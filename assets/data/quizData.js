const quizData = {
  title: "اختبار الوعي الذاتي",
  titleEn: "Self-Awareness Test",
  description: "اختبار قصير لتقييم حالتك النفسية وعلاقتك بذاتك",
  descriptionEn:
    "A short test to evaluate your mental state and relationship with yourself",
  questions: [
    {
      id: 1,
      text: "ما هو الشعور الأول الذي يسيطر عليك مؤخرًا؟",
      textEn: "What is the primary feeling that has dominated you recently?",
      options: [
        { id: "a", text: "ضياع أو تشتّت", textEn: "Lost or scattered" },
        { id: "b", text: "توتر أو قلق", textEn: "Tension or anxiety" },
        { id: "c", text: "فضول واهتمام", textEn: "Curiosity and interest" },
        {
          id: "d",
          text: "امتنان وطمأنينة",
          textEn: "Gratitude and reassurance",
        },
      ],
    },
    {
      id: 2,
      text: "عندما تنظر إلى آخر ثلاثة أشهر، هل تشعر بأنك:",
      textEn:
        "When looking at the last three months, do you feel that you are:",
      options: [
        { id: "a", text: "ثابت دون أي تغيير", textEn: "Static with no change" },
        {
          id: "b",
          text: "تتحرّك لكن بلا هدف واضح",
          textEn: "Moving but without a clear goal",
        },
        {
          id: "c",
          text: "تُحرز تقدمًا بسيطًا",
          textEn: "Making slight progress",
        },
        {
          id: "d",
          text: "أحرزت تطورًا واضحًا",
          textEn: "Achieved clear development",
        },
      ],
    },
    {
      id: 3,
      text: "كيف تتعامل مع مشاعرك؟",
      textEn: "How do you deal with your emotions?",
      options: [
        {
          id: "a",
          text: "أتجاهلها وأُكمل",
          textEn: "I ignore them and move on",
        },
        {
          id: "b",
          text: "أشعر بها لكن لا أستطيع التعبير عنها",
          textEn: "I feel them but can't express them",
        },
        {
          id: "c",
          text: "ألاحظها وأدوّنها أحيانًا",
          textEn: "I notice them and sometimes write them down",
        },
        {
          id: "d",
          text: "أحتويها وأمنحها مساحتها",
          textEn: "I embrace them and give them space",
        },
      ],
    },
    {
      id: 4,
      text: "هل تشعر بأنك تعيش وفقًا لقيمك؟",
      textEn: "Do you feel that you are living according to your values?",
      options: [
        {
          id: "a",
          text: "لا أعرف ما هي قيمي",
          textEn: "I don't know what my values are",
        },
        {
          id: "b",
          text: "أعرفها ولكن لا أعيشها",
          textEn: "I know them but don't live by them",
        },
        { id: "c", text: "أعيش بعضها", textEn: "I live by some of them" },
        {
          id: "d",
          text: "أعيشها بوعي يومي",
          textEn: "I live them with daily awareness",
        },
      ],
    },
    {
      id: 5,
      text: "عندما تُخطئ، كيف تتحدث مع نفسك؟",
      textEn: "When you make a mistake, how do you talk to yourself?",
      options: [
        { id: "a", text: "بقسوة ولوم", textEn: "With harshness and blame" },
        {
          id: "b",
          text: "بصمت وعتاب داخلي",
          textEn: "With silence and internal reproach",
        },
        {
          id: "c",
          text: "بتفهّم أحيانًا",
          textEn: "With understanding sometimes",
        },
        {
          id: "d",
          text: "بلطف وتشجيع",
          textEn: "With kindness and encouragement",
        },
      ],
    },
    {
      id: 6,
      text: "ما هي القيمة التي تشعر بأنها ناقصة في حياتك حاليًا؟",
      textEn: "What value do you feel is missing in your life right now?",
      options: [
        { id: "a", text: "الحرية", textEn: "Freedom" },
        { id: "b", text: "التوازن", textEn: "Balance" },
        { id: "c", text: "الإنجاز", textEn: "Achievement" },
        { id: "d", text: "الراحة النفسية", textEn: "Mental comfort" },
      ],
    },
    {
      id: 7,
      text: "كيف تبدأ يومك؟",
      textEn: "How do you start your day?",
      options: [
        {
          id: "a",
          text: "بفوضى وعشوائية",
          textEn: "With chaos and randomness",
        },
        {
          id: "b",
          text: "بسرعة ومن غير تفكير",
          textEn: "Quickly and without thinking",
        },
        {
          id: "c",
          text: "بمحاولة لتنظيمه",
          textEn: "With an attempt to organize it",
        },
        {
          id: "d",
          text: "بنية واضحة وروتين بسيط",
          textEn: "With clear intention and a simple routine",
        },
      ],
    },
    {
      id: 8,
      text: "هل لديك مساحة للتعبير عن ذاتك؟",
      textEn: "Do you have space to express yourself?",
      options: [
        { id: "a", text: "أبدًا", textEn: "Never" },
        { id: "b", text: "نادرًا", textEn: "Rarely" },
        { id: "c", text: "أحيانًا", textEn: "Sometimes" },
        {
          id: "d",
          text: "نعم، وأستفيد منها",
          textEn: "Yes, and I make use of it",
        },
      ],
    },
    {
      id: 9,
      text: "إذا كان لديك 10 دقائق لنفسك، ماذا تختار؟",
      textEn: "If you had 10 minutes for yourself, what would you choose?",
      options: [
        { id: "a", text: "تصفّح الهاتف", textEn: "Browsing my phone" },
        { id: "b", text: "النوم أو الهروب", textEn: "Sleep or escape" },
        {
          id: "c",
          text: "الكتابة أو التنفس بوعي",
          textEn: "Writing or conscious breathing",
        },
        {
          id: "d",
          text: "التواصل مع ذاتك أو مع الله",
          textEn: "Connecting with yourself or with God",
        },
      ],
    },
    {
      id: 10,
      text: "ما هي نيتك للفترة القادمة؟",
      textEn: "What is your intention for the coming period?",
      options: [
        { id: "a", text: "لا أعرف", textEn: "I don't know" },
        {
          id: "b",
          text: "أحتاج إلى مساعدة لاكتشافها",
          textEn: "I need help discovering it",
        },
        {
          id: "c",
          text: "لديّ فكرة لكنها غير واضحة",
          textEn: "I have an idea but it's not clear",
        },
        {
          id: "d",
          text: "أعرف نيّتي وأسعى لتحقيقها",
          textEn: "I know my intention and am working to achieve it",
        },
      ],
    },
  ],
  results: [
    {
      type: "a",
      title: 'مرحلة التيه – "أحتاج أن أعود إلى ذاتي"',
      titleEn: 'The Lost Phase – "I need to return to myself"',
      description:
        "أنت تمر بمرحلة تحتاج إلى تعاطف واحتواء. قد تشعر بالضياع أو التشتّت، والبداية الحقيقية تكون بخلق مساحة آمنة تسمح فيها لنفسك أن تسمع صوتك الداخلي.",
      descriptionEn:
        "You're going through a phase that needs empathy and containment. You may feel lost or scattered, and the real beginning is to create a safe space where you allow yourself to hear your inner voice.",
      advice:
        "ابدأ بخطوة بسيطة؛ كأن تكتب مشاعرك يوميًا أو تخلق روتينًا صغيرًا يمنحك الاستقرار. لا تتعجّل النتائج، الأهم هو أن تبدأ.",
      adviceEn:
        "Start with a simple step, such as writing your feelings daily or creating a small routine that gives you stability. Don't rush results; the most important thing is to begin.",
    },
    {
      type: "b",
      title: 'مرحلة الإدراك – "أرى لكن لا أستطيع التحرك"',
      titleEn: 'The Awareness Phase – "I see but I cannot move"',
      description:
        "بدأت تلاحظ ما يدور بداخلك لكن هناك مقاومة أو ارتباك و هناك بذرة وعي تحتاج إلى رعاية واهتمام.",
      descriptionEn:
        "You've started noticing what's happening inside you, but there's resistance or confusion. There's a seed of awareness that needs care and attention.",
      advice:
        "حاول تفكيك أفكارك ومخاوفك، واختر عادة بسيطة تعبّر عن قيمة تهمّك. الدعم النفسي أو العمل مع مدرّب قد يفتح أمامك أبوابًا جديدة.",
      adviceEn:
        "Try to break down your thoughts and fears, and choose a simple habit that expresses a value important to you. Psychological support or working with a coach may open new doors for you.",
    },
    {
      type: "c",
      title: 'مرحلة النمو – "أنا أتطور فعلًا"',
      titleEn: 'The Growth Phase – "I am actually developing"',
      description:
        "أنت في رحلة تطوّر مستمرة، وتعيش بعض قيمك وبدأت تربط بين مشاعرك وتصرفاتك.",
      descriptionEn:
        "You're on a continuous development journey, living some of your values and starting to connect your feelings with your actions.",
      advice:
        "ركّز على توسيع وعيك، واعمَل على تعميق نيتك وتحويلها إلى أفعال. أنت تسير في الاتجاه الصحيح.",
      adviceEn:
        "Focus on expanding your awareness, and work on deepening your intention and turning it into actions. You are moving in the right direction.",
    },
    {
      type: "d",
      title: 'مرحلة الاتساق – "أنا قريب من ذاتي"',
      titleEn: 'The Consistency Phase – "I am close to myself"',
      description:
        "تعيش بوعي واتصال حقيقي مع نفسك، وتدير حياتك بقيم واضحة ونيّة صادقة.",
      descriptionEn:
        "You live with awareness and genuine connection with yourself, and manage your life with clear values and sincere intention.",
      advice:
        "شارك تجربتك ووسّع أثرك. استخدم وعيك لتطوّر ذاتك وتدعم الآخرين من حولك.",
      adviceEn:
        "Share your experience and expand your impact. Use your awareness to develop yourself and support others around you.",
    },
  ],
};

export default quizData;
