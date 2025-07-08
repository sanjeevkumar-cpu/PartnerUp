
# PartnerUp - Collaborative Project Matching Platform

A modern web application that connects students and professionals to find perfect project collaborators based on skills and interests.

## 🚀 Features

- **Smart Project Matching**: Automatically displays projects that match your skills
- **User Authentication**: Secure sign-up and login system
- **Profile Management**: Comprehensive profiles with skills, experience, and education
- **Project Creation**: Easy-to-use interface for posting new projects
- **Application System**: Built-in system for applying to projects and managing applications
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Live data updates across the platform

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **React Router** - Client-side routing
- **React Query** - Data fetching and state management
- **Lucide React** - Beautiful icons

### Backend
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Relational database
- **Row Level Security** - Database-level security
- **Real-time subscriptions** - Live data updates

### Development Tools
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting
- **TypeScript** - Static type checking

## 🏗️ Architecture

The application follows a modern client-server architecture:

- **Frontend**: React SPA with TypeScript
- **Backend**: Supabase providing authentication, database, and real-time features
- **Database**: PostgreSQL with carefully designed schema and RLS policies
- **Deployment**: Vercel for frontend, Supabase for backend services

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd partnerup
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## 🗄️ Database Schema

The application uses the following main tables:

- **profiles** - User profiles with skills and experience
- **projects** - Project listings with requirements
- **project_applications** - Applications to projects
- **notifications** - User notifications

All tables are protected with Row Level Security (RLS) policies.

## 🔐 Authentication

The app uses Supabase Auth with the following features:
- Email/password authentication
- Secure session management
- Protected routes and data access
- Profile completion flow

## 📱 Key Pages

- **Landing Page** - Marketing and introduction
- **Home Dashboard** - Project feed with skill-based filtering
- **Profile Setup** - Onboarding and profile completion
- **My Projects** - User's created projects and applications
- **Authentication** - Sign up and login

## 🎨 UI/UX Features

- **Responsive Design** - Mobile-first approach
- **Modern Interface** - Clean, professional design
- **Interactive Components** - Smooth animations and transitions
- **Accessibility** - WCAG compliant components
- **Dark Mode Ready** - Prepared for theme switching

## 📊 Data Flow

1. Users create profiles with their skills and experience
2. Projects are filtered based on user skills
3. Users can apply to relevant projects
4. Project owners can manage applications
5. Real-time updates keep data synchronized

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### Environment Variables for Production
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Future Enhancements

- Real-time chat between collaborators
- Project progress tracking
- Team management features
- Advanced search and filtering
- Mobile app development
- Integration with version control systems

## 👥 Team

- **Your Name** - Full Stack Developer

## 📞 Contact

- **Email**: your.email@example.com
- **LinkedIn**: your-linkedin-profile
- **GitHub**: your-github-username

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the amazing backend platform
- [shadcn/ui](https://ui.shadcn.com) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Lucide](https://lucide.dev) for the icon library

---

**Built with ❤️ using modern web technologies**
