import { io, Socket } from 'socket.io-client'

interface ServerToClientEvents {
  'notification:new': (notification: any) => void
  'leave:updated': (data: { leaveId: string; status: string; updatedBy: string }) => void
  'interview:scheduled': (data: {
    interviewId: string
    candidateId: string
    scheduledAt: string
  }) => void
  'offer:sent': (data: { offerId: string; candidateId: string }) => void
  'attendance:checked-in': (data: { employeeId: string; timestamp: string }) => void
  'user:online': (data: { userId: string; status: 'online' | 'offline' }) => void
  'job:updated': (data: { jobId: string; action: string; updatedBy: string }) => void
  'application:updated': (data: {
    applicationId: string
    status: string
    updatedBy: string
  }) => void
}

interface ClientToServerEvents {
  'user:join': (userId: string) => void
  'user:leave': (userId: string) => void
  'notification:read': (notificationId: string) => void
  'typing:start': (data: { roomId: string; userId: string }) => void
  'typing:stop': (data: { roomId: string; userId: string }) => void
}

class WebSocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private eventListeners: Map<string, ((...args: unknown[]) => void)[]> = new Map()

  constructor() {
    this.connect()
  }

  private connect() {
    const token = localStorage.getItem('auth_token')
    const wsUrl = import.meta.env.VITE_WS_URL || 'wss://api.luwasuite.com'

    this.socket = io(wsUrl, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
    })

    this.setupEventListeners()
    this.setupReconnection()
  }

  private setupEventListeners() {
    if (!this.socket) return

    this.socket.on('connect', () => {
      console.log('WebSocket connected')
      this.reconnectAttempts = 0
      this.emit('connected')
    })

    this.socket.on('disconnect', reason => {
      console.log('WebSocket disconnected:', reason)
      this.emit('disconnected', reason)
    })

    this.socket.on('connect_error', error => {
      console.error('WebSocket connection error:', error)
      this.emit('connection_error', error)
    })

    // Business event listeners
    this.socket.on('notification:new', notification => {
      this.emit('notification:new', notification)
    })

    this.socket.on('leave:updated', data => {
      this.emit('leave:updated', data)
    })

    this.socket.on('interview:scheduled', data => {
      this.emit('interview:scheduled', data)
    })

    this.socket.on('offer:sent', data => {
      this.emit('offer:sent', data)
    })

    this.socket.on('attendance:checked-in', data => {
      this.emit('attendance:checked-in', data)
    })

    this.socket.on('user:online', data => {
      this.emit('user:online', data)
    })

    this.socket.on('job:updated', data => {
      this.emit('job:updated', data)
    })

    this.socket.on('application:updated', data => {
      this.emit('application:updated', data)
    })
  }

  private setupReconnection() {
    if (!this.socket) return

    this.socket.on('disconnect', () => {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnectAttempts++
          console.log(
            `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
          )
          this.connect()
        }, this.reconnectDelay * this.reconnectAttempts)
      }
    })
  }

  // Event system for React components
  on(event: string, callback: (...args: unknown[]) => void) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)!.push(callback)

    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(event)
      if (listeners) {
        const index = listeners.indexOf(callback)
        if (index > -1) {
          listeners.splice(index, 1)
        }
      }
    }
  }

  private emit(event: string, ...args: any[]) {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(callback => callback(...args))
    }
  }

  // User management
  joinRoom(userId: string) {
    this.socket?.emit('user:join', userId)
  }

  leaveRoom(userId: string) {
    this.socket?.emit('user:leave', userId)
  }

  // Notification management
  markNotificationRead(notificationId: string) {
    this.socket?.emit('notification:read', notificationId)
  }

  // Typing indicators
  startTyping(roomId: string, userId: string) {
    this.socket?.emit('typing:start', { roomId, userId })
  }

  stopTyping(roomId: string, userId: string) {
    this.socket?.emit('typing:stop', { roomId, userId })
  }

  // Connection status
  isConnected(): boolean {
    return this.socket?.connected || false
  }

  disconnect() {
    this.socket?.disconnect()
    this.socket = null
  }

  // Cleanup
  destroy() {
    this.disconnect()
    this.eventListeners.clear()
  }
}

// Create singleton instance
export const wsService = new WebSocketService()

// React hook for WebSocket
import { useEffect, useRef } from 'react'

export function useWebSocket() {
  const unsubscribeRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
  }, [])

  const subscribe = (event: string, callback: (...args: unknown[]) => void) => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current()
    }
    unsubscribeRef.current = wsService.on(event, callback)
  }

  return {
    subscribe,
    isConnected: wsService.isConnected(),
    joinRoom: wsService.joinRoom.bind(wsService),
    leaveRoom: wsService.leaveRoom.bind(wsService),
    markNotificationRead: wsService.markNotificationRead.bind(wsService),
    startTyping: wsService.startTyping.bind(wsService),
    stopTyping: wsService.stopTyping.bind(wsService),
  }
}

// Real-time data synchronization hook
export function useRealtimeData<T>(
  key: string,
  queryFn: () => Promise<{ data: T }>,
  options?: {
    enabled?: boolean
    refetchOnWindowFocus?: boolean
    onUpdate?: (data: T) => void
  }
) {
  const { data, refetch, ...query } = useApiQuery([key], queryFn, {
    enabled: options?.enabled,
    refetchOnWindowFocus: options?.refetchOnWindowFocus,
  })

  useEffect(() => {
    const unsubscribe = wsService.on(`${key}:updated`, () => {
      refetch()
    })

    return unsubscribe
  }, [key, refetch])

  useEffect(() => {
    if (data && options?.onUpdate) {
      options.onUpdate(data)
    }
  }, [data, options?.onUpdate])

  return { data, refetch, ...query }
}

// Import here to avoid circular dependency
import { useApiQuery } from './useApi'

export default wsService
