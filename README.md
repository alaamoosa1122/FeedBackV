# FeedBack - نظام تقييم الفعاليات

نظام تقييم الفعاليات للقرية الهندسية - تطبيق ويب يتيح للمستخدمين تقييم الفعاليات وإدارة المحتوى للمديرين.

## الميزات

- 🌟 تقييم الفعاليات من قبل المستخدمين
- 👨‍💼 لوحة تحكم للمديرين
- 🌐 دعم اللغتين العربية والإنجليزية
- 📱 تصميم متجاوب
- 🔐 نظام تسجيل دخول آمن للمديرين

## النشر على Render (مُوصى به للإنتاج)

### الخطوات السريعة
1. ارفع الكود إلى GitHub
2. اربط المستودع بـ Render
3. استخدم ملف `render.yaml` الموجود في المشروع
4. أضف متغيرات البيئة المطلوبة في Render

### متغيرات البيئة المطلوبة
```
MONGO_USERNAME=your_mongodb_username
MONGO_PASSWORD=your_mongodb_password
MONGO_DATABASE=your_database_name
NODE_ENV=production
REACT_APP_API_URL=https://your-server-url.onrender.com
```

## التشغيل باستخدام Docker (للتطوير المحلي)

### المتطلبات
- Docker Desktop
- Docker Compose

### الخطوات السريعة
```bash
# تشغيل التطبيق
./docker-run.sh

# أو يدوياً
docker-compose up --build
```

### الوصول للتطبيق
- **الواجهة الأمامية**: http://localhost:3000
- **الخادم**: http://localhost:3001

## التشغيل المحلي

### المتطلبات
- Node.js 18+
- MongoDB

### تثبيت التبعيات
```bash
# Client
cd Client
npm install

# Server
cd server
npm install
```

### تشغيل التطبيق
```bash
# تشغيل الخادم
cd server
npm start

# تشغيل الواجهة الأمامية (في terminal آخر)
cd Client
npm start
```

## الملفات المهمة

- `docker-compose.yml` - إعدادات Docker للتطوير
- `docker-compose.prod.yml` - إعدادات Docker للإنتاج
- `DOCKER_README.md` - دليل مفصل لـ Docker
- `.env.example` - مثال للمتغيرات البيئية

## المساهمة

1. Fork المشروع
2. إنشاء branch جديد
3. إجراء التغييرات
4. إرسال Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT.1
