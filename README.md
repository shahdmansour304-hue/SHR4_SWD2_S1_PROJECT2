<div dir="rtl" align="right">

# 🛒 LuxeCart Design System & E-Commerce Platform

An advanced, fully responsive E-commerce platform built as a graduation project. The application features a premium user interface, custom design system components, and smooth client-side interactions.

---

## 💡 فكرة المشروع (Project Concept)
تم بناء مشروع **LuxeCart** من الصفر باستخدام أحدث تقنيات الـ Frontend لضمان السرعة الفائقة والأداء المتميز في تصفح المنتجات وإدارة السلة وإتمام عمليات الشراء. المنصة تركز بشكل أساسي على تقديم تجربة تسوق فاخرة وسلسة ومريحة للمستخدم لتواكب المواقع العالمية الفخمة (Premium UX).

## 🎯 أهداف المشروع (Project Goals)
* **تجربة مستخدم فائقة (Premium UX):** تصميم واجهات تفاعلية جذابة وسهلة الاستخدام تناسب الهوية البصرية للمتاجر الفاخرة.
* **الأداء والسرعة الفائقة:** استغلال بيئة العمل الذكية لـ `Vite` لتقديم سرعة تحميل لحظية للمكونات والمنتجات.
* **التجاوب الكامل (Full Responsiveness):** دعم جميع الشاشات (موبايل، تابلت، شاشات مكتبية) بشكل مثالي وديناميكي باستخدام `Tailwind CSS`.

## 💎 الميزة التنافسية (Competitive Advantage)
* **Custom Design System:** تم بناء مكونات واجهة المستخدم (Buttons, Cards, Modals) بشكل خاص ومستقل دون الاعتماد على مكتبات جاهزة تقليدية، مما يمنح التطبيق مرونة تامة في التعديل وأداءً فائق الخفة.
* **Advanced State Management:** إدارة تفاعلية متطورة للسلة (`Cart`) والمفضلة (`Favorites`) تضمن تحديث البيانات فورياً وبسلاسة أمام العميل دون أي تأخير أو إعادة تحميل للصفحة.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)
* **Frontend Library:** `React.js` (TypeScript)
* **Build Tool:** `Vite` (For ultra-fast development and bundling)
* **Styling:** `Tailwind CSS` (For utility-first components and responsiveness)
* **Tools & Linters:** `ESLint`, `PostCSS`

---

## ✨ أهم مميزات المشروع (Key Features)
* 🛍️ **تصفح المنتجات:** عرض ذكي ومنظم للمنتجات مع إمكانية التصفية (Filtering).
* 🛒 **نظام السلة المتطور:** إضافة وتعديل كميات المنتجات داخل السلة وحساب الإجمالي فورياً.
* ❤️ **قائمة المفضلة:** حفظ المنتجات للرجوع إليها لاحقاً برابط سريع وسلس.
* 🔐 **نظام المصادقة والتأمين (Authentication):** واجهات مخصصة لتسجيل الدخول وإنشاء الحساب لحماية بيانات العملاء (Client-Side Simulation).
* 🌓 **الدعم اللوني التفاعلي:** هيكلية مهيأة ومستقرة لدعم الوضع الداكن والفاتح (Dark/Light Mode).

---

## 📂 شرح مختصر لملفات المشروع (Project Structure)

* `public/` : الملفات الثابتة، الصور، والأيقونات الأساسية للموقع.
* `src/components/` : العناصر المشتركة القابلة لإعادة الاستخدام مثل الأزرار، الكروت، ومربعات الحوار.
* `src/hooks/` : الـ Custom Hooks لإدارة الحالات والمفضلة والسلة بشكل محلي وديناميكي (`useFavorites`, `useCart`).
* `src/pages/` : صفحات النظام الأساسية مثل (`Home`, `Shop`, `Cart`, `Checkout`, `Product`, `Account`).
* `src/test/` : ملفات وإعدادات البيئة الاختبارية لضمان جودة الأكواد (Testing Setup).
* `src/App.tsx` : المكون الرئيسي المسؤول عن التوجيه والـ Routing بين الصفحات.
* `src/main.tsx` : نقطة انطلاق التطبيق وتحميل وإعداد ملفات الستايل الشاملة.

---

## 🚀 خطوات تشغيل المشروع محلياً (How to Run Locally)
لتشغيل المشروع على جهازك الشخصي، افتح الـ Terminal واكتب الأوامر التالية بالترتيب:

**1. تحميل المكتبات البرمجية والاعتمادات الأساسية:**
```bash
npm install
**2. تشغيل المشروع في بيئة التطوير المحلية:**
```bash
npm run dev
