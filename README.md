# HR & Recruitment Management System

A modern, enterprise-grade Human Resources and Recruitment Management System built with React, TypeScript, and modern web technologies.

## 🚀 Features

### Core HR Modules
- **Employee Management** - Complete employee lifecycle management
- **Recruitment Pipeline** - End-to-end hiring process
- **Leave Management** - Request, approval, and tracking system
- **Attendance Tracking** - Time management with location tracking
- **Performance Management** - Reviews, feedback, and analytics

### Advanced Features
- **Real-time Analytics** - Live dashboards and reporting
- **Document Management** - File upload and processing
- **Workflow Automation** - Approval processes and notifications
- **Multi-role Access** - Role-based permissions and security
- **Mobile Responsive** - Works on all devices

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **TanStack Query** - Powerful data fetching and caching

### UI Components
- **Headless UI** - Accessible component primitives
- **Heroicons** - Beautiful hand-crafted SVG icons
- **Chart.js** - Advanced charting and visualization
- **React Hook Form** - Performant forms with validation
- **React Dropzone** - File upload with drag-and-drop

### Development Tools
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Vitest** - Fast unit testing
- **React Testing Library** - Component testing utilities

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd hr-recruitment-system

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🐳 Docker Deployment

### Quick Start
```bash
# Build and run with Docker
docker build -t hr-system .
docker run -p 80:80 hr-system

# Or use Docker Compose
docker-compose up -d
```

### Production Deployment
```bash
# Build for production
npm run build

# Deploy with Docker
docker-compose -f docker-compose.yml up -d
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=https://api.yourcompany.com

# Application Settings
VITE_APP_NAME=HR System
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   ├── layout/         # Layout components
│   └── charts/         # Chart components
├── pages/              # Page components
│   ├── dashboard/
│   ├── employees/
│   ├── recruitment/
│   └── ...
├── hooks/              # Custom React hooks
├── services/           # API service functions
├── store/              # State management
├── types/              # TypeScript definitions
├── utils/              # Utility functions
├── constants/          # App constants
└── assets/             # Static assets
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## 📚 API Integration

The application is designed to work with RESTful APIs. Key endpoints include:

- `/api/v1/auth` - Authentication
- `/api/v1/employees` - Employee management
- `/api/v1/jobs` - Job postings
- `/api/v1/leaves` - Leave management
- `/api/v1/attendance` - Attendance tracking

See `src/services/api.ts` for complete API integration.

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Role-based Access Control** - Granular permissions
- **CSRF Protection** - Cross-site request forgery prevention
- **XSS Prevention** - Input sanitization and validation
- **Secure Headers** - Security headers configuration

## 📱 Mobile Responsiveness

The application is fully responsive and works on:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile phones (320px - 767px)

## 🚀 Performance

### Optimizations
- **Code Splitting** - Route-based and component-based splitting
- **Lazy Loading** - Components loaded on demand
- **Image Optimization** - Automatic image compression
- **Bundle Analysis** - Webpack bundle analyzer integration
- **Caching** - Intelligent caching strategies

### Performance Metrics
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **First Input Delay**: <100ms
- **Cumulative Layout Shift**: <0.1

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@yourcompany.com or join our Slack channel.

## 📊 Roadmap

### Phase 2 (Coming Soon)
- [ ] Real-time notifications with WebSocket
- [ ] Advanced analytics and BI dashboard
- [ ] Mobile app with React Native
- [ ] Multi-language support (i18n)
- [ ] Advanced reporting and exports
- [ ] Integration with third-party services

### Phase 3 (Future)
- [ ] AI-powered candidate matching
- [ ] Video interview integration
- [ ] Advanced performance reviews
- [ ] Employee self-service portal
- [ ] Integration with HRIS systems

---

**Built with ❤️ for modern HR management**