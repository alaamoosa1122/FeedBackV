# تشغيل التطبيق باستخدام Docker

## المتطلبات الأساسية
- Docker Desktop مثبت على جهازك
- Docker Compose مثبت على جهازك

## الخطوات

### 1. إعداد المتغيرات البيئية
قم بإنشاء ملف `.env` في المجلد الرئيسي للمشروع:

```bash
# MongoDB Configuration
MONGO_USERNAME=your_mongodb_username
MONGO_PASSWORD=your_mongodb_password
MONGO_DATABASE=your_database_name

# Node Environment
NODE_ENV=production

# API URL for Client
REACT_APP_API_URL=http://localhost:3001
```

### 2. بناء وتشغيل التطبيق
```bash
# بناء وتشغيل جميع الخدمات
docker-compose up --build

# أو لتشغيل في الخلفية
docker-compose up -d --build
```

### 3. الوصول للتطبيق
- **الواجهة الأمامية (Client)**: http://localhost:3000
- **الخادم (Server)**: http://localhost:3001

### 4. إيقاف التطبيق
```bash
# إيقاف جميع الخدمات
docker-compose down

# إيقاف وحذف الحاويات والصور
docker-compose down --rmi all
```

## أوامر مفيدة

### عرض الحاويات العاملة
```bash
docker-compose ps
```

### عرض سجلات التطبيق
```bash
# جميع الخدمات
docker-compose logs

# خدمة محددة
docker-compose logs client
docker-compose logs server
```

### إعادة بناء خدمة محددة
```bash
docker-compose up --build client
docker-compose up --build server
```

### حذف جميع الصور والحاويات
```bash
docker-compose down --rmi all --volumes --remove-orphans
```

## استكشاف الأخطاء

### إذا لم يعمل التطبيق
1. تأكد من أن Docker Desktop يعمل
2. تحقق من المتغيرات البيئية في ملف `.env`
3. تأكد من أن المنافذ 3000 و 3001 متاحة
4. راجع السجلات: `docker-compose logs`

### إذا لم تتصل قاعدة البيانات
1. تأكد من صحة بيانات MongoDB
2. تحقق من إعدادات الشبكة
3. تأكد من أن قاعدة البيانات متاحة من الإنترنت

## ملاحظات مهمة
- تأكد من تحديث عنوان API في Client إذا كنت تستخدم عنوان مختلف للخادم
- في بيئة الإنتاج، استخدم متغيرات بيئية آمنة
- تأكد من إعداد CORS بشكل صحيح في الخادم 