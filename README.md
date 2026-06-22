🛒 LuxeCart Design System & E-Commerce Platform
An advanced, fully responsive E-commerce platform built as a graduation project. The application features a premium user interface, custom design system components, and smooth client-side interactions.

💡 فكرة المشروع (Project Concept)
تم بناء المشروع من الصفر باستخدام أحدث تقنيات الـ Frontend لضمان السرعة الفائقة والأداء المتميز في تصفح المنتجات وإدارة السلة وإتمام عمليات الشراء. LuxeCart هو منصة تجارة إلكترونية متكاملة تركز على تقديم تجربة تسوق فاخرة وسلسة للمستخدم (Premium UX).

🎯 أهداف المشروع (Project Goals)
تجربة مستخدم فائقة (Premium UX): تصميم واجهات تفاعلية جذابة وسهلة الاستخدام تناسب الهوية البصرية للمتاجر الفاخرة.

الأداء والسرعة: استغلال بيئة العمل الذكية لـ Vite لتقديم سرعة تحميل تماثل المواقع العالمية.

التجاوب الكامل (Full Responsiveness): دعم جميع الشاشات (موبايل، تابلت، شاشات مكتبية) بشكل مثالي باستخدام Tailwind CSS.

💎 الميزة التنافسية (Competitive Advantage)
Custom Design System: تم بناء مكونات واجهة المستخدم (Buttons, Cards, Modals) بشكل خاص ومستقل دون الاعتماد الكامل على مكتبات جاهزة تقليدية، مما يمنح التطبيق مرونة تامة في التعديل وأداءً فائق الخفة.

Advanced State Management: إدارة تفاعلية متطورة للسلة (Cart) والمفضلة (Favorites) تضمن تحديث البيانات فورياً وبسلاسة أمام العميل دون أي تأخير أو إعادة تحميل للصفحة.

🛠️ التقنيات المستخدمة (Tech Stack)
Frontend Library: React.js (TypeScript)

Build Tool: Vite (For ultra-fast development and bundling)

Styling: Tailwind CSS (For utility-first components and responsiveness)

Tools & Linters: ESLint, PostCSS

✨ أهم مميزات المشروع (Key Features)
🛍️ تصفح المنتجات: عرض ذكي ومنظم للمنتجات مع إمكانية التصفية (Filtering).

🛒 نظام السلة المتطور: إضافة وتعديل كميات المنتجات داخل السلة وحساب الإجمالي فورياً.

❤️ قائمة المفضلة: حفظ المنتجات للرجوع إليها لاحقاً برابط سريع وسلس.

🔐 نظام المصادقة والتأمين (Authentication): واجهات مخصصة لتسجيل الدخول وإنشاء الحساب لحماية بيانات العملاء.

🌓 الدعم اللوني التفاعلي: هيكلية مهيأة لدعم الوضع الداكن والفاتح (Dark/Light Mode).

📂 شرح مختصر لملفات المشروع (Project Structure)
public/ : الملفات الثابتة والأيقونات الأساسية للموقع.

src/components/ : العناصر المشتركة القابلة لإعادة الاستخدام مثل الأزرار والكروت.

src/hooks/ : الـ Custom Hooks لإدارة الحالات والمفضلة والسلة (useFavorites, useCart).

src/pages/ : صفحات النظام الأساسية (Home, Shop, Cart, Checkout, Product, Account).

src/test/ : ملفات وإعدادات البيئة الاختبارية (Testing Setup).

src/App.tsx : المكون الرئيسي وملف التوجيه والـ Routing بين الصفحات.

src/main.tsx : نقطة انطلاق التطبيق وتحميل ملفات الستاينق.

🚀 خطوات تشغيل المشروع (How to Run Locally)
لتشغيل المشروع على جهازك بشكل محلي، افتح الـ Terminal واكتب الأوامر التالية بالترتيب:

تحميل المكتبات البرمجية والاعتمادات:
npm install

تشغيل المشروع في بيئة التطوير المحلية:
npm run dev

سيظهر لك رابط محلي (مثل: http://localhost:5173) قم بفتحه في المتصفح لاستعراض الموقع بشكل حي.

🛑 التحديات التي قابلتنا أثناء التنفيذ (Challenges & Solutions)
تزامن البيانات المحلي (State Persistence): واجهنا تحدي في الحفاظ على المنتجات داخل السلة والمفضلة عند قيام المستخدم بعمل لود أو Refresh للصفحة. قمنا بحل ذلك عبر بناء Custom Hooks تربط الـ State بالـ LocalStorage بشكل ديناميكي ومحمي لضمان تجربة مستخدم مستقرة.

تهيئة وإعداد بيئة TypeScript: في بداية الدمج واجهنا بعض التعارضات في الـ Types والموديلات الخاصة بالـ Components، وتم التغلب عليها بإعادة هيكلة ملفات الـ tsconfig بدقة لضمان استقرار الأكواد وتجنب أخطاء وقت البناء (Build time errors).

🔮 الأفكار والتطويرات المستقبلية (Future Work)
ربط بوابات الدفع الحقيقية: دمج خدمات دفع عالمية ومحلية مثل (Stripe / Fawry) لتأمين عمليات الشراء الفعلية.

لوحة تحكم ذكية (Admin Dashboard): بناء لوحة تحكم كاملة للمسؤولين لمتابعة الطلبات، المخزون، وتحليل المبيعات.

نظام التوصيات الذكي (AI Recommendations): دمج خوارزميات ذكاء اصطناعي بسيطة لترشيح المنتجات للمستخدمين بناءً على سلوك التصفح الخاص بهم.

👥 أسماء أعضاء الفريق (Team Members)
مجموعة من الطالبات المتميزات في تراك الـ Frontend Web Development:

Shahd Mansour Abdullah Abu Saada

Basant Roshdy Gouda El-Shahat

Rawan Mahmoud Hassan Ahmed

Doaa Akram Shehab

🎬 روابط الملحقات وتسليم المشروع (Project Links)
رابط المستودع (GitHub Repository): https://github.com/shahdmansour304-hue/SHR4_SWD2_S1_PROJECT2

رابط فيديو الشرح: [سيتم إضافة الرابط هنا فور تسجيل الفيديو]
