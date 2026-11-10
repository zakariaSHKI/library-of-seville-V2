// ========================================================
// Internationalization (i18n) Engine - Library of Seville
// Supports English ('en') and Arabic ('ar')
// ========================================================

(function () {
  const STORAGE_KEY = 'library_of_seville_lang';

  const translations = {
    en: {
      langName: 'English',
      dir: 'ltr',
      nav: {
        home: 'Home',
        books: 'Books',
        contact: 'Contact Us',
        browseBooks: 'Browse Books',
        toggleMenu: 'Toggle navigation menu',
        themeDark: 'Switch to dark mode',
        themeLight: 'Switch to light mode'
      },
      home: {
        heroTitle: 'Discover Your Next <span class="accent">Great Read</span>',
        heroDesc: "We're an online bookstore passionate about spreading knowledge and reading culture. Curated selections across history, philosophy, fantasy, economics — delivered across Algeria.",
        exploreBtn: 'Explore Collection',
        getInTouchBtn: 'Get in Touch',
        giraldaCaption: 'La Giralda de Sevilla — Our symbol of cultural heritage',
        ourStoryBadge: 'Our Story',
        whoWeAreTitle: 'Who We Are',
        whoWeAreDesc: 'Inspired by the rich cultural heritage of Seville, capital of Al-Andalus for over 300 years, we bring that same spirit of learning and discovery to readers across Algeria.',
        feature1Title: 'Curated Selection',
        feature1Desc: 'Hand-picked books across diverse genres — history, philosophy, fantasy, economics and more. Quality over quantity, every time.',
        feature2Title: 'Affordable Prices',
        feature2Desc: 'We believe knowledge should be accessible. Competitive pricing without compromising on book quality or service.',
        feature3Title: 'Nationwide Delivery',
        feature3Desc: 'Shipping to all 69 wilayas across Algeria. Your books delivered safely to your doorstep.',
        feature4Title: '24/7 Support',
        feature4Desc: 'Our dedicated customer service team is available around the clock to assist with any questions.',
        featuredTitle: 'Featured Books',
        searchPlaceholder: 'Search for a book...',
        viewAllBtn: 'View All Books',
        ctaTitle: 'Ready to Start Reading?',
        ctaDesc: 'Join thousands of readers discovering their next favorite book.',
        ctaBtn: 'Browse Collection'
      },
      books: {
        pageTitle: 'Our Collection',
        pageDesc: 'Discover carefully curated books across diverse genres. Every title selected for quality and impact.',
        allBooksTitle: 'All Books',
        searchPlaceholder: 'Search for a book...',
        noBooksTitle: 'No books found',
        noBooksDesc: 'Try adjusting your search terms'
      },
      order: {
        pageTitle: 'Place Your Order',
        backBtn: '← Back to Books',
        formTitle: 'Shipping & Contact Information',
        firstName: 'First Name *',
        firstNamePh: 'Your first name',
        lastName: 'Last Name *',
        lastNamePh: 'Your last name',
        email: 'Email *',
        emailPh: 'you@example.com',
        phone: 'Phone Number *',
        phonePh: '0555 12 34 56',
        address: 'Full Address *',
        addressPh: 'Street, building, apartment...',
        city: 'City *',
        cityPh: 'City / Municipality',
        wilaya: 'Wilaya *',
        wilayaPh: 'Wilaya name',
        wilayaSelect: 'Select a Wilaya',
        notes: 'Order Notes (optional)',
        notesPh: 'Delivery instructions...',
        placeOrderBtn: 'Place Order',
        placingOrderBtn: 'Placing order...',
        summaryTitle: 'Order Summary',
        bookLabel: 'Book',
        qtyLabel: 'Quantity',
        noBookSelected: 'Please select a book from the books page',
        confirmNotice: 'After placing your order, we will contact you via phone to confirm availability and delivery details.',
        orderSuccess: 'Order placed successfully! We will contact you to confirm delivery details.',
        orderIdPrefix: 'Order ID'
      },
      contact: {
        pageTitle: 'Contact Us',
        pageDesc: "Have questions? We'd love to hear from you. Reach out and we'll get back to you within 24 hours.",
        getInTouchTitle: 'Get In Touch',
        emailLabel: 'Email',
        phoneLabel: 'Phone',
        addressLabel: 'Address',
        addressValue: 'Algeria<br>Shipping to all 69 wilayas',
        formTitle: 'Send Us a Message',
        nameLabel: 'Full Name *',
        namePh: 'Your name',
        emailLabelForm: 'Email Address *',
        emailPh: 'you@example.com',
        subjectLabel: 'Subject *',
        topicDefault: 'Select a topic',
        topicOrder: 'Order Inquiry',
        topicShipping: 'Shipping Question',
        topicReturns: 'Returns & Exchanges',
        topicGeneral: 'General Question',
        topicFeedback: 'Feedback',
        topicOther: 'Other',
        messageLabel: 'Message *',
        messagePh: 'How can we help you?',
        sendBtn: 'Send Message',
        sendingBtn: 'Sending...',
        sentSuccess: 'Thank you! We received your message and will get back to you shortly.',
        valRequired: 'Please fill in all required fields.',
        valEmail: 'Please enter a valid email address.'
      },
      footer: {
        brandDesc: 'Library of Seville — Spreading knowledge and reading culture across Algeria, inspired by the heritage of Al-Andalus.',
        quickLinks: 'Quick Links',
        categories: 'Categories',
        history: 'History',
        philosophy: 'Philosophy',
        fantasy: 'Fantasy',
        economics: 'Economics',
        contact: 'Contact',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        copyright: '© 2024 Library of Seville. All rights reserved.'
      },
      common: {
        buyNow: 'Buy Now'
      },
      bookCatalog: {
        1: {
          title: "Rich Dad, Poor Dad",
          author: "Robert T. Kiyosaki",
          year: "1997",
          summary: "A personal finance classic on building wealth through financial literacy."
        },
        2: {
          title: "The Art of War",
          author: "Sun Tzu",
          year: "5th century BC",
          summary: "A classic military treatise on strategy and tactics."
        },
        3: {
          title: "Crime and Punishment",
          author: "Fyodor Dostoevsky",
          year: "1866",
          summary: "A deep dive into morality and existentialism."
        },
        4: {
          title: "Jurassic Park",
          author: "Michael Crichton",
          year: "1990",
          summary: "A science thriller about resurrected dinosaurs and the limits of technology."
        },
        5: {
          title: "1984",
          author: "George Orwell",
          year: "1949",
          summary: "A chilling dystopian narrative about totalitarianism."
        },
        6: {
          title: "The Muqaddimah",
          author: "Ibn Khaldun",
          year: "1406",
          summary: "A foundational text on sociology and historiography."
        }
      }
    },
    ar: {
      langName: 'العربية',
      dir: 'rtl',
      nav: {
        home: 'الرئيسية',
        books: 'الكتب',
        contact: 'تواصل معنا',
        browseBooks: 'تصفح الكتب',
        toggleMenu: 'فتح قائمة التنقل',
        themeDark: 'تفعيل الوضع الليلي',
        themeLight: 'تفعيل الوضع النهاري'
      },
      home: {
        heroTitle: 'اكتشف كتابك المفضل <span class="accent">القادم</span>',
        heroDesc: 'مكتبة إلكترونية شغوفة بنشر المعرفة وثقافة القراءة. مختارات منتقاة بعناية في التاريخ، الفلسفة، الفانتازيا، والاقتصاد — مع التوصيل لكافة ولايات الجزائر.',
        exploreBtn: 'استكشف المجموعة',
        getInTouchBtn: 'تواصل معنا',
        giraldaCaption: 'خيرالدا إشبيلية — رمز تراثنا الثقافي الأندلسي',
        ourStoryBadge: 'قصتنا',
        whoWeAreTitle: 'من نحن',
        whoWeAreDesc: 'مستوحاة من التراث الثقافي العريق لإشبيلية، عاصمة الأندلس لأكثر من 300 عام، ننقل نفس روح التعلم والبحث والاكتشاف إلى القراء في جميع أنحاء الجزائر.',
        feature1Title: 'مختارات مميزة',
        feature1Desc: 'كتب مختارة بعناية في شتى المجالات — التاريخ، الفلسفة، الأدب، الفانتازيا، الاقتصاد والمزيد. الجودة دائماً أولاً.',
        feature2Title: 'أسعار مناسبة',
        feature2Desc: 'نؤمن بأن المعرفة حق للجميع. أسعار تنافسية مع الحفاظ التام على جودة الكتب والطباعة والخدمة.',
        feature3Title: 'توصيل لكافة الولايات',
        feature3Desc: 'الشحن متوفر إلى جميع الـ 69 ولاية في الجزائر. كتبك المفضلة تصلك بأمان حتى باب منزلك.',
        feature4Title: 'دعم متواصل 24/7',
        feature4Desc: 'فريق خدمة العملاء جاهز دائماً على مدار الساعة لمساعدتكم والإجابة عن كل استفساراتكم.',
        featuredTitle: 'كتب مختارة',
        searchPlaceholder: 'ابحث عن كتاب أو مؤلف...',
        viewAllBtn: 'عرض جميع الكتب',
        ctaTitle: 'هل أنت جاهز لبدء رحلة القراءة؟',
        ctaDesc: 'انضم إلى آلاف القراء الذين يكتشفون كتبهم المفضلة كل يوم.',
        ctaBtn: 'تصفح المجموعة'
      },
      books: {
        pageTitle: 'مجموعتنا الكاملة',
        pageDesc: 'اكتشف عناوين منتقاة بعناية في مختلف مجالات المعرفة والأدب. كل كتاب تم اختياره ليترك أثراً حقيقياً.',
        allBooksTitle: 'جميع الكتب',
        searchPlaceholder: 'ابحث عن كتاب أو مؤلف...',
        noBooksTitle: 'لم يتم العثور على نتائج',
        noBooksDesc: 'يرجى تجربة كلمات بحث أخرى أو تصفح كافة التصنيفات'
      },
      order: {
        pageTitle: 'إتمام طلب الشراء',
        backBtn: 'العودة إلى الكتب ←',
        formTitle: 'معلومات الشحن والتواصل',
        firstName: 'الاسم الأول *',
        firstNamePh: 'اسمك الأول',
        lastName: 'اللقب *',
        lastNamePh: 'لقبك / اسم العائلة',
        email: 'البريد الإلكتروني *',
        emailPh: 'you@example.com',
        phone: 'رقم الهاتف *',
        phonePh: '0555 12 34 56',
        address: 'العنوان الكامل *',
        addressPh: 'الشارع، رقم العمارة، الشقة...',
        city: 'المدينة / البلدية *',
        cityPh: 'المدينة أو البلدية',
        wilaya: 'الولاية *',
        wilayaPh: 'اسم الولاية',
        wilayaSelect: 'اختر الولاية',
        notes: 'ملاحظات إضافية (اختياري)',
        notesPh: 'تعليمات خاصة بالتوصيل...',
        placeOrderBtn: 'تأكيد الطلب',
        placingOrderBtn: 'جاري إرسال الطلب...',
        summaryTitle: 'ملخص الطلب',
        bookLabel: 'الكتاب',
        qtyLabel: 'الكمية',
        noBookSelected: 'يرجى اختيار كتاب من صفحة الكتب أولاً',
        confirmNotice: 'بعد إرسال الطلب، سنتواصل معك هاتفياً لتأكيد التوفر وتفاصيل التوصيل.',
        orderSuccess: 'تم تسجيل طلبك بنجاح! سنتواصل معك قريباً لتأكيد تفاصيل التوصيل.',
        orderIdPrefix: 'رقم الطلب'
      },
      contact: {
        pageTitle: 'تواصل معنا',
        pageDesc: 'هل لديك استفسار أو اقتراح؟ يسعدنا دائماً تواصلك معنا وسنرد عليك في أقرب وقت خلال 24 ساعة.',
        getInTouchTitle: 'معلومات التواصل',
        emailLabel: 'البريد الإلكتروني',
        phoneLabel: 'الهاتف',
        addressLabel: 'العنوان',
        addressValue: 'الجزائر<br>التوصيل إلى جميع الـ 69 ولاية',
        formTitle: 'أرسل لنا رسالة',
        nameLabel: 'الاسم الكامل *',
        namePh: 'اسمك الكامل',
        emailLabelForm: 'البريد الإلكتروني *',
        emailPh: 'you@example.com',
        subjectLabel: 'الموضوع *',
        topicDefault: 'اختر موضوع الاستفسار',
        topicOrder: 'استفسار عن طلب',
        topicShipping: 'سؤال حول التوصيل والشحن',
        topicReturns: 'الإرجاع والاستبدال',
        topicGeneral: 'استفسار عام',
        topicFeedback: 'ملاحظات واقتراحات',
        topicOther: 'موضوع آخر',
        messageLabel: 'الرسالة *',
        messagePh: 'كيف يمكننا مساعدتك؟',
        sendBtn: 'إرسال الرسالة',
        sendingBtn: 'جاري الإرسال...',
        sentSuccess: 'شكراً لك! تلقينا رسالتك وسنعاود الاتصال بك قريباً جداً.',
        valRequired: 'يرجى ملء جميع الحقول المطلوبة.',
        valEmail: 'يرجى إدخال بريد إلكتروني صحيح.'
      },
      footer: {
        brandDesc: 'مكتبة إشبيلية — نشر المعرفة وثقافة القراءة في شتى أنحاء الجزائر، مستلهمة من عبق الحضارة الأندلسية.',
        quickLinks: 'روابط سريعة',
        categories: 'التصنيفات',
        history: 'التاريخ',
        philosophy: 'الفلسفة',
        fantasy: 'الفانتازيا',
        economics: 'الاقتصاد',
        contact: 'اتصل بنا',
        privacy: 'سياسة الخصوصية',
        terms: 'شروط الخدمة',
        copyright: '© 2024 مكتبة إشبيلية. جميع الحقوق محفوظة.'
      },
      common: {
        buyNow: 'اشترِ الآن'
      },
      bookCatalog: {
        1: {
          title: "الأب الغني والأب الفقير",
          author: "روبرت كيوساكي",
          year: "1997",
          summary: "كتاب كلاسيكي في التمويل الشخصي حول بناء الثروة من خلال محو الأمية المالية."
        },
        2: {
          title: "فن الحرب",
          author: "سون تزو",
          year: "القرن الخامس ق.م",
          summary: "أشهر أطروحة عسكرية كلاسيكية في الاستراتيجيات والتكتيكات وإدارة النزاعات."
        },
        3: {
          title: "الجريمة والعقاب",
          author: "فيودور دوستويفسكي",
          year: "1866",
          summary: "غوص عميق في النفس البشرية، الأخلاق، الصراع النفسي وفلسفة الوجود."
        },
        4: {
          title: "حديقة الديناصورات (جوراسيك بارك)",
          author: "مايكل كرايتون",
          year: "1990",
          summary: "رواية خيال علمي وتشويق مبهرة حول إحياء الديناصورات وعواقب الغرور التقني."
        },
        5: {
          title: "1984",
          author: "جورج أورويل",
          year: "1949",
          summary: "تحفة ديستوبية خالدة تتناول مخاطر الأنظمة الشمولية وتزييف الحقيقة وحرية الفكر."
        },
        6: {
          title: "مقدمة ابن خلدون",
          author: "ابن خلدون",
          year: "1406",
          summary: "النص التأسيسي التاريخي الرائد في علم الاجتماع وفلسفة التاريخ والعمران البشري."
        }
      }
    }
  };

  function getSavedLang() {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get('lang');
      if (urlLang === 'en' || urlLang === 'ar') {
        try { localStorage.setItem(STORAGE_KEY, urlLang); } catch (e) {}
        return urlLang;
      }
    } catch (e) {}
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === 'en' || saved === 'ar')) return saved;
    } catch (e) {}
    return 'en';
  }

  let currentLang = getSavedLang();

  function resolvePath(obj, path) {
    if (!path) return undefined;
    const parts = path.split('.');
    let cur = obj;
    for (let part of parts) {
      if (cur === undefined || cur === null) return undefined;
      cur = cur[part];
    }
    return cur;
  }

  function t(key, fallback = '') {
    const val = resolvePath(translations[currentLang], key);
    if (val !== undefined) return val;
    const enVal = resolvePath(translations.en, key);
    return enVal !== undefined ? enVal : fallback;
  }

  function getLocalizedBook(book) {
    if (!book) return book;
    const id = book.id;
    const catalog = translations[currentLang]?.bookCatalog;
    const localized = catalog && catalog[id];
    if (localized) {
      return {
        ...book,
        title: localized.title || book.title,
        author: localized.author || book.author,
        year: localized.year || book.year,
        summary: localized.summary || book.summary
      };
    }
    return book;
  }

  function applyLanguage(lang) {
    currentLang = (lang === 'ar') ? 'ar' : 'en';
    try {
      localStorage.setItem(STORAGE_KEY, currentLang);
    } catch (e) {}

    const htmlEl = document.documentElement;
    htmlEl.lang = currentLang;
    htmlEl.dir = translations[currentLang].dir;

    // 1. Text translations
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (val !== undefined) {
        if (el.hasAttribute('data-i18n-html')) {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // 2. Placeholder translations
    document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
      const key = el.getAttribute('data-i18n-ph');
      const val = t(key);
      if (val !== undefined) {
        el.setAttribute('placeholder', val);
      }
    });

    // 3. Aria-label translations
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      const val = t(key);
      if (val !== undefined) {
        el.setAttribute('aria-label', val);
      }
    });

    // 4. Update language toggle buttons
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      const btnLang = btn.getAttribute('data-lang-btn');
      if (btnLang === currentLang) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    // 5. Notify any page-specific listeners
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: currentLang } }));
  }

  function setLanguage(lang) {
    applyLanguage(lang);
  }

  function init() {
    applyLanguage(currentLang);

    // Delegate clicks for any language buttons in the DOM
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.lang-btn');
      if (btn) {
        const lang = btn.getAttribute('data-lang-btn');
        if (lang && lang !== currentLang) {
          setLanguage(lang);
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose global i18n object
  window.i18n = {
    getLang: () => currentLang,
    setLang: setLanguage,
    t: t,
    getBook: getLocalizedBook,
    translations: translations
  };
  window.t = t;
  window.getLocalizedBook = getLocalizedBook;
})();
