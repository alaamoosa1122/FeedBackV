# FeedBack - نظام تقييم الفعاليات

نظام تقييم الفعاليات للقرية الهندسية - تطبيق ويب يتيح للمستخدمين تقييم الفعاليات وإدارة المحتوى للمديرين.

## الميزات

- 🌟 تقييم الفعاليات من قبل المستخدمين
- 👨‍💼 لوحة تحكم للمديرين
- 🌐 دعم اللغتين العربية والإنجليزية
- 📱 تصميم متجاوب
- 🔐 نظام تسجيل دخول آمن للمديرين

## التشغيل باستخدام Docker (مُوصى به)

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
