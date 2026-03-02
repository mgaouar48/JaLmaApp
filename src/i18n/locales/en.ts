export default {
    // ── Common ──
    common: {
        appName: 'Ja-Lma',
        tagline: 'WATER AT YOUR DOOR',
        next: 'Next',
        skip: 'Skip',
        confirm: 'Confirm',
        cancel: 'Cancel',
        back: 'Back',
        save: 'Save',
        ok: 'OK',
        error: 'Error',
        success: 'Success',
        loading: 'Loading...',
        km: 'km',
        min: 'min',
        da: 'DA',
        liters: 'L',
    },

    // ── Onboarding ──
    onboarding: {
        title: 'Easily order your ',
        titleHighlight: 'water tanker',
        description: 'Fast and reliable delivery straight to your home or worksite.',
    },

    // ── Auth ──
    auth: {
        welcomeTitle: 'Welcome to Ja-Lma',
        welcomeSubtitle: 'Pure water delivery to your door',
        emailOrPhone: 'Email or Phone',
        emailPlaceholder: 'e.g: john@example.com',
        password: 'Password',
        forgotPassword: 'Forgot password?',
        login: 'Sign in',
        noAccount: "Don't have an account?",
        createAccount: 'Create an account',
        transporterSpace: 'Transporter Space',
        registerTitle: 'Create an account',
        registerSubtitle: 'Join Ja-Lma for simplified water delivery',
        lastName: 'LAST NAME',
        lastNamePlaceholder: 'Your last name',
        firstName: 'FIRST NAME',
        firstNamePlaceholder: 'Your first name',
        phoneNumber: 'PHONE NUMBER',
        termsPrefix: 'By signing up, you agree to our ',
        termsOfUse: 'Terms of Use',
        termsAnd: ' and our ',
        privacyPolicy: 'Privacy Policy',
        register: 'Sign up',
        hasAccount: 'Already have an account?',
        transporterLogin: 'Ja-Lma',
        transporterSubtitle: 'Transporter Space',
        becomeTransporter: 'Become a transporter (Sign up)',
        noAccountYet: "Don't have an account yet?",
        transporterRegisterTitle: 'Transporter Registration',
        transporterRegisterSubtitle: 'Create your professional account',
        vehicleType: 'Vehicle type',
        tankCapacity: 'Tank capacity',
        city: 'City',
        cityPlaceholder: 'e.g: Tlemcen',
        acceptTerms: 'I accept the terms of use and privacy policy',
        createMyAccount: 'Create my account',
        step: 'Step',
        personalInfo: 'Personal information',
        vehicleInfo: 'Vehicle information',
        forgotPasswordTitle: 'Forgot password',
        resetTitle: 'Reset',
        resetSubtitle: 'Enter your phone number to receive a verification code.',
        sendCode: 'Send code',
        verificationTitle: 'Verification',
        verificationCode: 'Verification code',
        codeSentTo: 'We sent a code to +213 ',
        resendCodeIn: 'Resend code in ',
        resend: 'Resend',
        verify: 'Verify',
        newPasswordTitle: 'New password',
        secureAccount: 'Secure your account',
        newPasswordSubtitle: 'Enter your new password. It must be at least 8 characters.',
        newPassword: 'New password',
        confirmPassword: 'Confirm password',
        passwordsMismatch: 'Passwords do not match.',
        passwordResetSuccess: 'Your password has been reset.',
    },

    // ── Tabs ──
    tabs: {
        home: 'Home',
        history: 'History',
        wallet: 'Wallet',
        profile: 'Profile',
        missions: 'Missions',
        revenue: 'Revenue',
    },

    // ── Client Home ──
    client: {
        greeting: 'Hello, {{name}}',
        availableTransporters: 'Available Transporters',
        sort_distance: 'Distance',
        sort_price: 'Price',
        sort_rating: 'Rating',
        all: 'All',
    },

    // ── Order Config ──
    orderConfig: {
        transporter: 'Transporter',
        orderFor: 'Order - {{name}}',
        waterVolume: 'Water Volume',
        selectCapacity: 'Select the desired capacity',
        promoCode: 'Promo Code',
        enterPromo: 'Enter your promo code',
        apply: 'Apply',
        globalPromoApplied: 'Promo code applied: -{{discount}} DA',
        summerPromoApplied: 'Summer promo applied: Free!',
        promoApplied: 'Promo code applied: -{{discount}} DA',
        invalidPromo: 'Invalid promo code',
        deliveryLocation: 'Delivery Location',
        enterAddressOrPin: 'Enter the address or drag the pin on the map',
        enterAddress: 'Enter your address...',
        tapOrDragPin: 'Tap or drag the pin',
        confirmPosition: 'Confirm position',
        estimatedTotal: 'Estimated Total',
        free: 'Free',
    },

    // ── Live Tracking ──
    tracking: {
        driverOnWay: 'Driver is on the way',
        estimatedArrival: 'Estimated arrival',
        enRoute: 'En route to you',
        call: 'Call',
        simulationDone: 'Simulation: Done',
        totalDistance: 'Total distance',
        price: 'Price',
        callDriver: 'Call driver',
        driverInfo: 'Driver info',
        arrived: 'Arrived',
        tank: 'Tank',
        eta: 'Time remaining',
    },

    // ── Active Delivery ──
    delivery: {
        enRouteToClient: 'En route to client',
        arrivedAtClient: 'Arrived at client',
        arrived: 'Arrived',
        remainingTime: 'Remaining time',
        totalDistance: 'Total distance',
        tariff: 'Tariff',
        iArrived: "I've arrived",
        finalizeDelivery: 'Finalize delivery',
        deliveryComplete: 'Delivery complete',
        orderFinalized: 'Order {{orderId}} finalized successfully!',
        me: 'Me',
    },

    // ── Transporter Home ──
    transporter: {
        offline: 'Offline',
        online: 'Online',
        waitingForOrders: 'Waiting for orders...',
        newOrder: 'New Order!',
        location: 'Location',
        distance: 'Distance',
        volume: 'Volume',
        tariff: 'Tariff',
        orderRejected: 'Order rejected',
        orderRejectedMsg: 'The order has been rejected.',
        orderAccepted: 'Order accepted',
        orderAcceptedMsg: 'You accepted order {{id}}',
        // Dashboard
        hello: 'Hello',
        todayRevenue: "Today's Revenue",
        lastTrip: 'Last Trip',
        completedOrders: 'Completed Orders',
        nextMission: 'Next Mission',
    },

    // ── New Mission ──
    newMission: {
        title: 'New Mission',
        urgent: 'Urgent',
        destination: 'Destination',
        distance: 'Distance',
        remuneration: 'Remuneration',
        reject: 'Reject',
        accept: 'Accept',
    },

    // ── History ──
    history: {
        title: 'History',
        all: 'All',
        inProgress: 'In progress',
        completed: 'Completed',
        cancelled: 'Cancelled',
        noOrders: 'No orders found',
        endOfHistory: "You've seen all history",
    },

    // ── Wallet ──
    wallet: {
        title: 'Wallet',
        comingSoon: 'Coming soon',
        managePayments: 'Manage your payments and transactions here.',
    },

    // ── Profile ──
    profile: {
        title: 'Profile',
        editProfile: 'Edit profile',
        notifications: 'Notifications',
        helpSupport: 'Help & Support',
        about: 'About',
        language: 'Language',
        logout: 'Logout',
        myDocuments: 'My documents',
        transporterRole: 'Transporter • Tank {{capacity}}L',
    },

    // ── Language ──
    lang: {
        title: 'Language',
        arabic: 'Arabic',
        french: 'French',
        english: 'English',
        changeLangRestart: 'The app will restart to apply the change.',
    },

    // ── Edit Profile ──
    editProfile: {
        title: 'Edit profile',
        firstNameLabel: 'First name',
        lastNameLabel: 'Last name',
        emailLabel: 'Email',
        dobLabel: 'Date of birth (optional)',
        genderLabel: 'Gender',
        male: 'Male',
        female: 'Female',
        saveChanges: 'Save changes',
    },

    // ── Help & Support ──
    help: {
        title: 'Help & Support',
        faqTitle: 'Frequently asked questions',
        contactTitle: 'Contact us',
    },

    // ── About ──
    about: {
        title: 'About',
        version: 'Version',
    },

    // ── Rating ──
    rating: {
        title: 'Rating',
        deliveryComplete: 'Delivery complete!',
        howWasDelivery: 'How was your delivery?',
        yourRating: 'Your rating',
        whatDidYouLike: 'What did you like?',
        commentOptional: 'Comment (optional)',
        shareFeedback: 'Share your experience...',
        submit: 'Submit',
        punctuality: 'Punctuality',
        service: 'Service',
        waterQuality: 'Water Quality',
        communication: 'Communication',
        cleanliness: 'Cleanliness',
    },

    // ── Promos ──
    promos: {
        title: 'Promotions',
        available: 'Available promo codes',
        useCode: 'Use code',
        activate: 'Activate',
        activated: 'Activated',
        promoActivated: 'Promo Activated',
        promoAppliedMsg: 'Code {{code}} has been applied to your next order.',
    },

    // ── Missions ──
    missions: {
        title: 'My missions',
        newMission: 'New mission',
        all: 'All',
        pending: 'Pending',
        active: 'Active',
        done: 'Done',
        noMissions: 'No missions',
    },

    // ── Revenue ──
    revenue: {
        title: 'Revenue',
        today: 'Today',
        thisWeek: 'This week',
        thisMonth: 'This month',
        totalEarnings: 'Total earnings',
        trips: 'trips',
    },
} as const;
