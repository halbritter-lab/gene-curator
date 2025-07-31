# Archived Current Codebase - Vue CLI + Firebase Implementation

This directory contains the complete current implementation that was running on the `refactor` branch before the architectural transformation.

## Contents

```
current_codebase/
├── README.md                    # This documentation
├── package.json                 # Vue CLI project dependencies
├── package-lock.json           # Dependency lock file
├── babel.config.js             # Babel transpilation config
├── jsconfig.json               # JavaScript project configuration
├── vue.config.js               # Vue CLI build configuration
├── webpack.config.js           # Additional webpack configuration
├── src/                        # Main application source code
│   ├── App.vue                 # Root Vue component
│   ├── main.js                 # Application entry point
│   ├── components/             # Reusable Vue components
│   ├── views/                  # Page-level components
│   ├── router/                 # Vue Router configuration
│   ├── stores/                 # Firebase integration stores
│   ├── config/                 # Workflow configuration system
│   ├── firebase/               # Firebase initialization
│   ├── functions/              # Utility functions
│   └── utils/                  # Validation and helper utilities
└── public/                     # Static assets
    ├── index.html              # HTML template
    ├── favicon.ico             # Application favicon
    └── img/                    # Application images and logos
```

## Technology Stack (Archived)

- **Vue.js**: 3.2.13 with Composition API
- **Vue CLI**: 5.0.0 for build system
- **Vuetify**: 3.4.8 for Material Design UI
- **Firebase**: 10.7.1 for database and authentication
- **Vue Router**: 4.2.5 for client-side routing

## Key Features Preserved

1. **Configuration-Driven Workflows**: Complete workflow system in `src/config/workflows/`
2. **Dynamic Form Rendering**: Components that render forms based on configuration
3. **Firebase Integration**: Full CRUD operations with role-based access control
4. **Material Design UI**: Consistent Vuetify-based user interface
5. **Multi-Stage Workflow**: Gene → Precuration → Curation workflow

## Important Configuration Files

### Workflow Configurations
- `src/config/workflows/KidneyGeneticsGeneCuration/workflowConfig.js`
- `src/config/workflows/KidneyGeneticsGeneCuration/geneDetailsConfig.js`
- `src/config/workflows/KidneyGeneticsGeneCuration/precurationDetailsConfig.js`
- `src/config/workflows/KidneyGeneticsGeneCuration/curationDetailsConfig.js`

### Application Configuration
- `src/config/appConfig.json` - Application-level settings
- `src/config/userRolesConfig.js` - User role definitions
- `src/config/menuConfig.json` - Navigation menu structure

### Firebase Configuration
- `src/firebase/index.js` - Firebase initialization and connection
- Security rules and authentication setup (external to codebase)

## Component Architecture

### Core Components
- `DataDisplayTable.vue` - Flexible table component for all data views
- `CurationForm.vue` - Main curation form with configuration-driven rendering
- `PrecurationForm.vue` - Precuration workflow form
- `HelpIcon.vue` - Context-sensitive help system

### Store Pattern
- `src/stores/geneStore.js` - Gene data management
- `src/stores/curationsStore.js` - Curation workflow management
- `src/stores/precurationsStore.js` - Precuration management
- `src/stores/usersStore.js` - User management
- `src/stores/AuthService.js` - Firebase authentication integration

## Migration Notes

This codebase represents the working state before refactoring began. Key elements to preserve in the new architecture:

1. **Configuration System**: The workflow configuration approach is a major strength
2. **Dynamic Rendering**: Components that render based on configuration should be enhanced
3. **User Experience**: The established UX patterns work well for scientific workflows
4. **Data Validation**: Existing validation logic should be enhanced, not replaced

## Running This Archived Version

To run this archived version for reference:

```bash
cd plan/archived/current_codebase
npm install
npm run serve
```

**Note**: Requires Node.js 16.20.0 and valid Firebase configuration in `.env.local`

## Relationship to New Architecture

This archived codebase serves as the reference implementation for:
- Database schema design (understanding current data structures)
- API endpoint design (replicating current functionality)
- Frontend component requirements (preserving successful UX patterns)
- Configuration system preservation (maintaining workflow flexibility)

The new PostgreSQL + FastAPI + Vue 3/Vite architecture will preserve all the successful patterns from this implementation while adding ClinGen compliance and modern performance optimizations.