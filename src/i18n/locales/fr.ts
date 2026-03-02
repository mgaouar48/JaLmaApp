export default {
    // ── Common ──
    common: {
        appName: 'Ja-Lma',
        tagline: "L'EAU À VOTRE PORTE",
        next: 'Suivant',
        skip: 'Passer',
        confirm: 'Confirmer',
        cancel: 'Annuler',
        back: 'Retour',
        save: 'Enregistrer',
        ok: 'OK',
        error: 'Erreur',
        success: 'Succès',
        loading: 'Chargement...',
        km: 'km',
        min: 'min',
        da: 'DA',
        liters: 'L',
    },

    // ── Onboarding ──
    onboarding: {
        title: 'Commandez facilement votre ',
        titleHighlight: "citerne d'eau",
        description: 'Livraison rapide et fiable directement à votre domicile ou chantier.',
    },

    // ── Auth ──
    auth: {
        welcomeTitle: 'Bienvenue chez Ja-Lma',
        welcomeSubtitle: "Livraison d'eau pure à domicile",
        emailOrPhone: 'Email ou Téléphone',
        emailPlaceholder: 'ex: jean@example.com',
        password: 'Mot de passe',
        forgotPassword: 'Mot de passe oublié ?',
        login: 'Se connecter',
        noAccount: 'Pas encore de compte ?',
        createAccount: 'Créer un compte',
        transporterSpace: 'Espace Transporteur',
        registerTitle: 'Créer un compte',
        registerSubtitle: "Rejoignez Ja-Lma pour une livraison d'eau simplifiée",
        lastName: 'NOM',
        lastNamePlaceholder: 'Votre nom de famille',
        firstName: 'PRÉNOM',
        firstNamePlaceholder: 'Votre prénom',
        phoneNumber: 'NUMÉRO DE TÉLÉPHONE',
        termsPrefix: "En vous inscrivant, vous acceptez nos ",
        termsOfUse: "Conditions d'Utilisation",
        termsAnd: ' et notre ',
        privacyPolicy: 'Politique de Confidentialité',
        register: "S'inscrire",
        hasAccount: 'Déjà un compte ?',
        transporterLogin: 'Ja-Lma',
        transporterSubtitle: 'Espace Transporteur',
        becomeTransporter: 'Devenir transporteur (Inscription)',
        noAccountYet: 'Pas encore de compte ?',
        transporterRegisterTitle: 'Inscription Transporteur',
        transporterRegisterSubtitle: 'Créez votre compte professionnel',
        vehicleType: 'Type de véhicule',
        tankCapacity: 'Capacité de la citerne',
        city: 'Ville',
        cityPlaceholder: 'ex: Tlemcen',
        acceptTerms: "J'accepte les conditions d'utilisation et la politique de confidentialité",
        createMyAccount: 'Créer mon compte',
        step: 'Étape',
        personalInfo: 'Informations personnelles',
        vehicleInfo: 'Informations véhicule',
        forgotPasswordTitle: 'Mot de passe oublié',
        resetTitle: 'Réinitialisation',
        resetSubtitle: 'Entrez votre numéro de téléphone pour recevoir un code de vérification.',
        sendCode: 'Envoyer le code',
        verificationTitle: 'Vérification',
        verificationCode: 'Code de vérification',
        codeSentTo: 'Nous avons envoyé un code au +213 ',
        resendCodeIn: 'Renvoyer le code dans ',
        resend: 'Renvoyer',
        verify: 'Vérifier',
        newPasswordTitle: 'Nouveau mot de passe',
        secureAccount: 'Sécurisez votre compte',
        newPasswordSubtitle: 'Entrez votre nouveau mot de passe. Il doit contenir au moins 8 caractères.',
        newPassword: 'Nouveau mot de passe',
        confirmPassword: 'Confirmer le mot de passe',
        passwordsMismatch: 'Les mots de passe ne correspondent pas.',
        passwordResetSuccess: 'Votre mot de passe a été réinitialisé.',
    },

    // ── Tabs ──
    tabs: {
        home: 'Accueil',
        history: 'Historique',
        wallet: 'Portefeuille',
        profile: 'Profil',
        missions: 'Missions',
        revenue: 'Revenus',
    },

    // ── Client Home ──
    client: {
        greeting: 'Bonjour, {{name}}',
        availableTransporters: 'Transporteurs disponibles',
        sort_distance: 'Distance',
        sort_price: 'Prix',
        sort_rating: 'Note',
        all: 'Tous',
    },

    // ── Order Config ──
    orderConfig: {
        transporter: 'Transporteur',
        orderFor: 'Commande - {{name}}',
        waterVolume: "Volume d'eau",
        selectCapacity: 'Sélectionnez la capacité souhaitée',
        promoCode: 'Code Promo',
        enterPromo: 'Entrez votre code promo',
        apply: 'Appliquer',
        globalPromoApplied: 'Code promo appliqué : -{{discount}} DA',
        summerPromoApplied: "Code promo d'été appliqué : Gratuit !",
        promoApplied: 'Code promo appliqué : -{{discount}} DA',
        invalidPromo: 'Code promo invalide',
        deliveryLocation: 'Lieu de livraison',
        enterAddressOrPin: "Saisissez l'adresse ou déplacez le pin sur la carte",
        enterAddress: 'Saisissez votre adresse...',
        tapOrDragPin: 'Appuyez ou déplacez le pin',
        confirmPosition: 'Confirmer la position',
        estimatedTotal: 'Total estimé',
        free: 'Gratuit',
    },

    // ── Live Tracking ──
    tracking: {
        driverOnWay: 'Le chauffeur est en route',
        estimatedArrival: 'Arrivée estimée',
        enRoute: 'En route vers vous',
        call: 'Appeler',
        simulationDone: 'Simulation : Terminée',
        totalDistance: 'Distance totale',
        price: 'Tarif',
        callDriver: 'Appeler le chauffeur',
        driverInfo: 'Infos chauffeur',
        arrived: 'Arrivé',
        tank: 'Citerne',
        eta: 'Temps restant',
    },

    // ── Active Delivery ──
    delivery: {
        enRouteToClient: 'En route vers le client',
        arrivedAtClient: 'Arrivé chez le client',
        arrived: 'Arrivé',
        remainingTime: 'Temps restant',
        totalDistance: 'Distance totale',
        tariff: 'Tarif',
        iArrived: 'Je suis arrivé',
        finalizeDelivery: 'Finaliser la livraison',
        deliveryComplete: 'Livraison terminée',
        orderFinalized: 'Commande {{orderId}} finalisée avec succès !',
        me: 'Moi',
    },

    // ── Transporter Home ──
    transporter: {
        offline: 'Hors Ligne',
        online: 'En Ligne',
        waitingForOrders: 'En attente de commandes...',
        newOrder: 'Nouvelle Commande !',
        location: 'Localisation',
        distance: 'Distance',
        volume: 'Volume',
        tariff: 'Tarif',
        orderRejected: 'Commande refusée',
        orderRejectedMsg: 'La commande a été refusée.',
        orderAccepted: 'Commande acceptée',
        orderAcceptedMsg: 'Vous avez accepté la commande {{id}}',
        // Dashboard
        hello: 'Bonjour',
        todayRevenue: "Revenu d'aujourd'hui",
        lastTrip: 'Dernier trajet',
        completedOrders: 'Commandes terminées',
        nextMission: 'Prochaine mission',
    },

    // ── New Mission ──
    newMission: {
        title: 'Nouvelle Mission',
        urgent: 'Urgent',
        destination: 'Destination',
        distance: 'Distance',
        remuneration: 'Rémunération',
        reject: 'Refuser',
        accept: 'Accepter',
    },

    // ── History ──
    history: {
        title: 'Historique',
        all: 'Tous',
        inProgress: 'En cours',
        completed: 'Terminé',
        cancelled: 'Annulé',
        noOrders: 'Aucune commande trouvée',
        endOfHistory: "Vous avez vu tout l'historique",
    },

    // ── Wallet ──
    wallet: {
        title: 'Portefeuille',
        comingSoon: 'Fonctionnalité à venir',
        managePayments: 'Gérez vos paiements et vos transactions ici.',
    },

    // ── Profile ──
    profile: {
        title: 'Profil',
        editProfile: 'Modifier le profil',
        notifications: 'Notifications',
        helpSupport: 'Aide & Support',
        about: 'À propos',
        language: 'Langue',
        logout: 'Déconnexion',
        myDocuments: 'Mes documents',
        transporterRole: 'Transporteur • Citerne {{capacity}}L',
    },

    // ── Language ──
    lang: {
        title: 'Langue',
        arabic: 'Arabe',
        french: 'Français',
        english: 'Anglais',
        changeLangRestart: "L'application va redémarrer pour appliquer le changement.",
    },

    // ── Edit Profile ──
    editProfile: {
        title: 'Modifier le profil',
        firstNameLabel: 'Prénom',
        lastNameLabel: 'Nom',
        emailLabel: 'Email',
        dobLabel: 'Date de naissance (optionnel)',
        genderLabel: 'Genre',
        male: 'Homme',
        female: 'Femme',
        saveChanges: 'Enregistrer les modifications',
    },

    // ── Help & Support ──
    help: {
        title: 'Aide & Support',
        faqTitle: 'Questions fréquentes',
        contactTitle: 'Contactez-nous',
    },

    // ── About ──
    about: {
        title: 'À propos',
        version: 'Version',
    },

    // ── Rating ──
    rating: {
        title: 'Évaluation',
        deliveryComplete: 'Livraison terminée !',
        howWasDelivery: "Comment s'est passée votre livraison ?",
        yourRating: 'Votre évaluation',
        whatDidYouLike: "Qu'avez-vous apprécié ?",
        commentOptional: 'Commentaire (optionnel)',
        shareFeedback: 'Partagez votre expérience...',
        submit: 'Envoyer',
        punctuality: 'Ponctualité',
        service: 'Service',
        waterQuality: "Qualité de l'eau",
        communication: 'Communication',
        cleanliness: 'Propreté',
    },

    // ── Promos ──
    promos: {
        title: 'Promotions',
        available: 'Codes promo disponibles',
        useCode: 'Utiliser le code',
        activate: 'Activer',
        activated: 'Activé',
        promoActivated: 'Promo Activée',
        promoAppliedMsg: 'Le code {{code}} a été appliqué à votre prochaine commande.',
    },

    // ── Missions ──
    missions: {
        title: 'Mes missions',
        newMission: 'Nouvelle mission',
        all: 'Toutes',
        pending: 'En attente',
        active: 'Actives',
        done: 'Terminées',
        noMissions: 'Aucune mission',
    },

    // ── Revenue ──
    revenue: {
        title: 'Revenus',
        today: "Aujourd'hui",
        thisWeek: 'Cette semaine',
        thisMonth: 'Ce mois',
        totalEarnings: 'Gains totaux',
        trips: 'courses',
    },
} as const;
