# دليل النشر والتثبيت

## 🚀 البدء السريع

### المتطلبات الأساسية
- Node.js 18+
- pnpm أو npm
- حساب GitHub
- رمز الوصول (GitHub Token)

### التثبيت المحلي

```bash
# 1. استنساخ المشروع
git clone https://github.com/your-username/your-repo.git
cd your-repo

# 2. تثبيت المكتبات
pnpm install

# 3. إعداد متغيرات البيئة
cp .env.example .env.local
```

### تعيين متغيرات البيئة

أنشئ ملف `.env.local` بالبيانات التالية:

```env
# كلمة المرور الإدارية
ADMIN_PASSWORD=your-very-secure-password-here

# GitHub Integration
GITHUB_TOKEN=ghp_your_github_token_here
GITHUB_REPO=your-username/your-repository
GITHUB_BRANCH=main
GITHUB_DATA_PATH=data/app-data.json

# اختياري: Node Environment
NODE_ENV=development
```

### تشغيل الخادم المحلي

```bash
pnpm dev
```

ثم افتح http://localhost:3000 في المتصفح.

---

## 🔐 إنشاء رموز الوصول

### 1. إنشاء GitHub Token

1. اذهب إلى GitHub Settings → Developer settings → Personal access tokens
2. اختر "Tokens (classic)"
3. انقر "Generate new token"
4. حدد الصلاحيات:
   - `repo` - الوصول الكامل للمستودعات
   - `workflow` - التحكم في GitHub Actions
5. انسخ الرمز واحفظه بأمان

### 2. تعيين كلمة المرور الإدارية

```bash
# اختياري: إنشاء كلمة مرور آمنة عشوائية
openssl rand -base64 32
```

---

## 📦 النشر على Vercel

### الخطوة الأولى: ربط المشروع

1. اذهب إلى [Vercel](https://vercel.com)
2. اضغط "New Project"
3. اختر "Import Git Repository"
4. ارفع مستودع GitHub الخاص بك
5. اختر Framework: "Next.js"

### الخطوة الثانية: إعداد متغيرات البيئة

في صفحة "Configure Project":

1. اذهب إلى "Environment Variables"
2. أضف المتغيرات:
   ```
   ADMIN_PASSWORD = your-secure-password
   GITHUB_TOKEN = ghp_xxxxxxxxxxxx
   GITHUB_REPO = your-username/your-repo
   GITHUB_BRANCH = main
   GITHUB_DATA_PATH = data/app-data.json
   ```
3. اختر الـ Environments:
   - Production
   - Preview
   - Development

### الخطوة الثالثة: النشر

1. انقر "Deploy"
2. انتظر انتهاء عملية البناء
3. سيتم إنشاء URL فريدة للموقع

---

## 🔧 المتطلبات الإضافية

### يجب توفر المجلدات التالية:

```
project-root/
├── data/
│   └── app-data.json      # ملف البيانات الرئيسي
├── public/
│   └── images/
│       └── subjects/      # صور المواد الدراسية
├── app/
├── components/
├── lib/
└── ...
```

### ملف `data/app-data.json`

يجب أن يحتوي على البيانات الأساسية. إذا كان فارغاً، سيتم استخدام البيانات الافتراضية.

---

## 🐛 استكشاف الأخطاء والمشاكل الشائعة

### مشكلة: "GITHUB_TOKEN غير محدد"

**الحل:**
```bash
# تحقق من متغيرات البيئة
echo $GITHUB_TOKEN

# تعيد تعيين في .env.local
GITHUB_TOKEN=ghp_your_token_here
```

### مشكلة: "فشل الاتصال بـ GitHub"

**الحل:**
1. تحقق من صحة الرمز
2. تأكد من صلاحيات `repo` و `workflow`
3. تحقق من اتصالك بالإنترنت

### مشكلة: "لا توجد ملفات بيانات"

**الحل:**
```bash
# أنشئ ملف البيانات
mkdir -p data
echo '{}' > data/app-data.json
```

### مشكلة: "Error: PORT 3000 is already in use"

**الحل:**
```bash
# استخدم منفذ مختلف
PORT=3001 pnpm dev

# أو قتل العملية القديمة
kill $(lsof -t -i:3000)
```

---

## 📝 نصائح التطوير

### تشغيل مع TypeScript Check

```bash
pnpm typecheck
```

### تشغيل ESLint

```bash
pnpm lint
```

### بناء الإنتاج محلياً

```bash
pnpm build
pnpm start
```

### مسح ذاكرة التخزين المؤقتة

```bash
# حذف مجلد .next
rm -rf .next

# إعادة التشغيل
pnpm dev
```

---

## 🔄 تحديث الموقع

### طريقة 1: Git Push (الموصى به)

```bash
# جعل التغييرات
git add .
git commit -m "chore: update content"
git push origin main

# سيتم النشر تلقائياً على Vercel
```

### طريقة 2: تحديث يدوي من Vercel

1. اذهب إلى لوحة التحكم Vercel
2. اختر المشروع
3. انقر "Redeploy" (لإعادة النشر)

### طريقة 3: من لوحة التحكم الإدارية

- جميع التعديلات تُحفظ تلقائياً
- يتم إنشاء commits تلقائية في GitHub
- Vercel تُحدث تلقائياً

---

## 🛡️ أفضل الممارسات الأمان

### 1. حماية كلمة المرور
- استخدم كلمة مرور قوية (32+ حرف)
- غيّرها بانتظام
- لا تشاركها مع أحد

### 2. حماية GitHub Token
- قيّد الصلاحيات للضروري فقط
- قم بتدويرها بانتظام
- لا تحفظها في الكود

### 3. حماية البيانات
- استخدم HTTPS دائماً
- احفظ نسخ احتياطية في GitHub
- راقب سجلات الوصول

### 4. الخوادم الآمنة
- استخدم خوادم موثوقة
- قم بتحديثات الأمان بانتظام
- راقب سجلات النظام

---

## 📊 المراقبة والتتبع

### عرض السجلات

**محلياً:**
```bash
# في المتصفح: http://localhost:3000
# افتح DevTools (F12)
# شاهد Console و Network
```

**على Vercel:**
1. اذهب إلى المشروع
2. اختر "Deployments"
3. انقر على نشر محدد
4. اختر "Logs"

### متابعة الأداء

- استخدم Google PageSpeed Insights
- استخدم Lighthouse
- راقب Core Web Vitals في Vercel

---

## 🔄 النسخ الاحتياطية

### نسخ احتياطية تلقائية

- جميع التغييرات محفوظة في GitHub
- كل عملية تعديل تُنشئ commit
- يمكنك التراجع إلى أي إصدار سابق

### نسخ احتياطية يدوية

```bash
# تحميل نسخة من البيانات
git log --oneline data/app-data.json | head -10

# استعادة إصدار سابق
git checkout COMMIT_HASH -- data/app-data.json
```

---

## 🚀 نصائح الإطلاق

### قبل الإطلاق الأول

- ✅ اختبر جميع الوظائف
- ✅ تحقق من الصور والروابط
- ✅ اختبر من أجهزة مختلفة
- ✅ تأكد من سرعة التحميل

### بعد الإطلاق

- ✅ انتظر التأكد من الاستقرار
- ✅ استجب للمستخدمين سريعاً
- ✅ احفظ بيانات الخوادم
- ✅ راقب الأداء

---

## 📞 الدعم التقني

### للمساعدة:

1. اقرأ الأدلة الموجودة أولاً
2. تحقق من سجلات الأخطاء
3. جرب حلول استكشاف الأخطاء
4. تواصل مع فريق الدعم

### معلومات التواصل:

- **البريد:** support@example.com
- **الهاتف:** +966 XX XXX XXXX
- **الموقع:** https://example.com/support

---

## ✅ قائمة التحقق النهائية

- [ ] تعيين متغيرات البيئة
- [ ] اختبار الاتصال بـ GitHub
- [ ] بناء المشروع بنجاح
- [ ] اختبار لوحة التحكم الإدارية
- [ ] اختبار من أجهزة مختلفة
- [ ] التحقق من الأمان
- [ ] إعداد النسخ الاحتياطية
- [ ] نشر على Vercel
- [ ] اختبار الموقع المباشر
- [ ] توثيق المعلومات الهامة

---

**الآن أنت جاهز للنشر! 🎉**
