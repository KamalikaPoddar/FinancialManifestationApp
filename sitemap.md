manifestation-board/
│
├── components/
│   ├── layout/
│   │   ├── Layout.js
│   │   └── Navbar.js
│   ├── onboarding/
│   │   ├── WelcomeScreen.js
│   │   └── AccountSetup.js
│   ├── goals/
│   │   ├── GoalSetting.js
│   │   └── ManifestationBoard.js
│   ├── financial/
│   │   ├── FinancialCalculator.js
│   │   └── ScenarioSimulator.js
│   └── ui/
│       ├── Button.js
│       └── Modal.js
│
├── pages/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth].js
│   │   ├── financial/
│   │   │   ├── account-aggregator.js
│   │   │   └── credit-bureau.js
│   │   └── goals/
│   │       └── create-goal.js
│   ├── _app.js
│   ├── index.js
│   ├── onboarding.js
│   ├── dashboard.js
│   └── goals.js
│
├── lib/
│   ├── financial-calculator.js
│   ├── scenario-simulator.js
│   └── account-aggregator.js
│
├── context/
│   └── AuthContext.js
│
├── hooks/
│   └── useFinancialData.js
│
├── styles/
│   └── globals.css
│
└── next.config.js
