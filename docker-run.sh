#!/bin/bash

# Script لتشغيل التطبيق باستخدام Docker

echo "🚀 بدء تشغيل تطبيق FeedBack باستخدام Docker..."

# التحقق من وجود Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker غير مثبت. يرجى تثبيت Docker أولاً."
    exit 1
fi

# التحقق من وجود Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose غير مثبت. يرجى تثبيت Docker Compose أولاً."
    exit 1
fi

# التحقق من وجود ملف .env
if [ ! -f .env ]; then
    echo "⚠️  ملف .env غير موجود. إنشاء ملف .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ تم إنشاء ملف .env من .env.example"
        echo "📝 يرجى تعديل ملف .env بمعلومات قاعدة البيانات الخاصة بك"
    else
        echo "❌ ملف .env.example غير موجود"
        exit 1
    fi
fi

# بناء وتشغيل التطبيق
echo "🔨 بناء وتشغيل التطبيق..."
docker-compose up --build -d

# انتظار قليل للتطبيق لبدء التشغيل
echo "⏳ انتظار بدء تشغيل التطبيق..."
sleep 10

# التحقق من حالة الحاويات
echo "📊 حالة الحاويات:"
docker-compose ps

echo ""
echo "✅ تم تشغيل التطبيق بنجاح!"
echo "🌐 الواجهة الأمامية: http://localhost:3000"
echo "🔧 الخادم: http://localhost:3001"
echo ""
echo "لإيقاف التطبيق: docker-compose down"
echo "لعرض السجلات: docker-compose logs" 