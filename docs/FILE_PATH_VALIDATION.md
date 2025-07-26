# File Path Case Sensitivity Validation

این پروژه شامل ابزارهایی برای جلوگیری از مشکلات case sensitivity در مسیرهای فایل است که معمولاً هنگام deploy کردن روی سیستم‌های Linux/macOS رخ می‌دهد.

## مشکل

در Windows، سیستم فایل case-insensitive است، یعنی `image.PNG` و `image.png` یکسان در نظر گرفته می‌شوند. اما در Linux و macOS، سیستم فایل case-sensitive است و این دو فایل متفاوت هستند.

## راه‌حل‌های پیاده شده

### 1. اسکریپت بررسی مسیرها (`scripts/check-file-paths.js`)

اسکریپتی که تمام فایل‌های Vue/JS/TS را اسکن می‌کند و مشکلات case sensitivity در مسیرهای تصاویر را شناسایی می‌کند.

**استفاده:**
```bash
npm run check-paths
```

**ویژگی‌ها:**
- بررسی مسیرهای تصاویر در `/images/`
- تشخیص case mismatch و فایل‌های missing
- نمایش واضح مشکلات و راه‌حل‌ها
- فقط مشکلات case sensitivity باعث fail شدن می‌شوند

### 2. Pre-commit Hook

هر commit به صورت خودکار بررسی می‌شود تا مشکلات case sensitivity commit نشوند.

**فایل:** `.husky/pre-commit`

### 3. Composable امن (`composables/useSafeImage.js`)

ابزاری برای مدیریت امن تصاویر با error handling بهتر.

**استفاده:**
```javascript
const { createImageLoadHandler, getSafeImagePath } = useSafeImage()

// در template
<img 
  :src="getSafeImagePath('/images/my-image.png')"
  @error="createImageLoadHandler()"
  alt="My Image"
>
```

### 4. Plugin توسعه (`plugins/file-path-validator.client.js`)

در حالت development، به صورت خودکار تصاویر را validate می‌کند و در console هشدار می‌دهد.

**ویژگی‌ها:**
- فقط در development mode فعال است
- بررسی خودکار پس از load شدن صفحه
- هشدار در console برای تصاویر شکسته

## بهترین روش‌ها

### 1. نام‌گذاری فایل‌ها
```bash
# ✅ درست
my-image.png
user-avatar.jpg
logo-small.svg

# ❌ غلط
MyImage.PNG
User_Avatar.JPG
logoSmall.SVG
```

### 2. قبل از commit
```bash
# همیشه قبل از commit اجرا کنید
npm run check-paths

# یا lint و check-paths با هم
npm run pre-commit
```

### 3. در کامپوننت‌ها
```vue
<template>
  <img 
    src="/images/token/my-token.svg"
    alt="Token"
    @error="handleImageError"
    loading="lazy"
  >
</template>

<script setup>
const { createImageLoadHandler } = useSafeImage()
const handleImageError = createImageLoadHandler()
</script>
```

## عیب‌یابی

### مشکل: تصویر در Windows کار می‌کند ولی در Linux نه
1. `npm run check-paths` را اجرا کنید
2. case mismatch را پیدا کنید
3. نام فایل یا مسیر را اصلاح کنید

### مشکل: Pre-commit hook fail می‌شود
1. خروجی اسکریپت را بخوانید
2. مشکلات case sensitivity را حل کنید
3. دوباره commit کنید

### مشکل: تصویر در development نمایش داده نمی‌شود
1. Console browser را چک کنید
2. Plugin خودکار هشدار می‌دهد
3. مسیر فایل را بررسی کنید

## مثال‌های رایج

### قبل (مشکل‌دار):
```vue
<img src="/images/token/CTA/CTA_People_mobile.svg" alt="People">
```

### بعد (درست):
```vue
<img src="/images/token/CTA/CTA_People_Mobile.svg" alt="People">
```

## نکات مهم

- ⚠️ همیشه قبل از PR، `npm run check-paths` را اجرا کنید
- 🔍 در development، console browser را برای هشدارها چک کنید  
- 📝 از نام‌گذاری consistent استفاده کنید
- 🚀 Pre-commit hook به صورت خودکار شما را محافظت می‌کند

## پشتیبانی

اگر مشکلی داشتید، می‌توانید:
1. `npm run check-paths` را اجرا کنید
2. خروجی را با تیم به اشتراک بگذارید
3. از composable `useSafeImage` استفاده کنید