<template>
  <v-container>
    <h1 class="text-center">
      {{ form.schoolTitle }}
    </h1>
    <div
      id="school-list-edit"
      class="mt-4"
    >
      <v-form
        ref="form"
        lazy-validation
      >
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="form.stateTitle"
              disabled
              label="استان"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="form.regionTitle"
              disabled
              label="ناحیه"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="form.stageTitle"
              disabled
              label="مقطع"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="form.genderTypeTitle"
              disabled
              label="جنسیت"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="form.organizationTypeTitle"
              disabled
              label="نوع مدرسه"
            />
          </v-col>
          <v-col cols="4" />
        </v-row>

        <v-text-field
          v-model="form.schoolTitle"
          disabled
          label="عنوان مدرسه"
        />

        <v-text-field
          v-model="form.schoolTitle2"
          outlined
          label="عنوان مدرسه 2"
        />
        <v-text-field
          v-model="form.address"
          disabled
          label="آدرس"
        />
        <v-text-field
          v-model="form.address2"
          label="آدرس2"
          outlined
        />
        <v-autocomplete
          v-model="form.city"
          :items="cityList"
          label="شهر"
          outlined
        />

        <!-- <v-text-field v-model="form.tel" label="تلفن"></v-text-field>
      <v-text-field v-model="form.tel2" label="تلفن 2"></v-text-field> -->

        <v-text-field
          v-model="form.majors"
          outlined
          label="برچسب ها"
        />

        <div class="text-center">
          <v-btn
            color="success"
            class="mr-4"
            :loading="update_loading"
            @click="updatePage"
          >
            بروزرسانی
          </v-btn>

          <v-btn
            color="error"
            class="mr-4"
            :loading="delete_loading"
            @click="destroySchool"
          >
            حذف
          </v-btn>
        </div>
      </v-form>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'EditSchool',
  layout: 'admin',
  data() {
    return {
      update_loading: false,
      cityList: [
        'تبریز',
        'سردرود',
        'خسروشاه',
        'باسمنج',
        'مراغه',
        'خداجو',
        'اهر',
        'سراب',
        'مهربان',
        'شربیان',
        'دوزدوزان',
        'مرند',
        'زنوز',
        'بناب مرند',
        'یامچی',
        'کشکسرای',
        'دیزج حسین بیگ',
        'میانه',
        'آچاچی',
        'آقکند',
        'ترکمانچای',
        'ترک',
        'هشترود',
        'نظر کهریزی',
        'کلیبر',
        'آبش احمد',
        'هریس',
        'زرنق',
        'بخشایش',
        'کلوانق',
        'خواجه',
        'اربطان',
        'بناب',
        'خوشه مهر',
        'بستان آباد',
        'کرد کندی',
        'تیکمه داش',
        'شبستر',
        'خامنه',
        'شرفخانه',
        'شند آباد',
        'سیس',
        'وایقان',
        'کوزه کنان',
        'علیشاه',
        'داریان',
        'صوفیان',
        'تسوج',
        'جلفا',
        'هادیشهر',
        'سیه رود',
        'ملکان',
        'مبارک شهر',
        'لیلان',
        'ممقان',
        'گوگان',
        'تیمورلو',
        'آذر شهر',
        'اسکو',
        'شهر جدید سهند',
        'ایلخچی',
        'قره آغاج',
        'عجب شیر',
        'جوان قلعه',
        'ورزقان',
        'خاروانا',
        'خمارلو',
        'لاریجان',
        'عاشقلو',
        'هوراند',
        'ارومیه',
        'سیلوانه',
        'سرو',
        'قوشچی',
        'نوشین',
        'خوی',
        'دیزج دیز',
        'ایواوغلی',
        'زرآباد',
        'قطور',
        'فیرورق',
        'مهاباد',
        'گوگ تپه',
        'خلیفان',
        'ماکو',
        'بازرگان',
        'سلماس',
        'تازه شهر',
        'میاندوآب',
        'بکتاش',
        'نقده',
        'محمدیار',
        'پیرانشهر',
        'لاجان',
        'سردشت',
        'میرآباد',
        'نلاس',
        'ربط',
        'بوکان',
        'سیمینه',
        'تکاب',
        'تازه کند نصرت آباد',
        'شاهین دژ',
        'محمود آباد',
        'کشاورز',
        'اشنویه',
        'نالوس',
        'سیه چشمه',
        'آواجیق',
        'پلدشت',
        'نازک علیا',
        'قره ضیاء الدین',
        'حاجیلار',
        'شوط',
        'یولاگلدی',
        'مرگنلر',
        'چهاربرج',
        'باروق',
        'اصفهان',
        'بهارستان',
        'قهجاورستان',
        'زیار',
        'قمصر',
        'کامو و چوگان',
        'جوشقان قالی',
        'کاشان',
        'مشکات',
        'نیاسر',
        'برزک',
        'گلپایگان',
        'گوگد',
        'گلشهر',
        'شهرضا',
        'منظریه',
        'داران',
        'دامنه',
        'نائین',
        'بافران',
        'انارک',
        'اردستان',
        'زواره',
        'مهاباد',
        'نجف آباد',
        'گلدشت',
        'کهریز سنگ',
        'جوزدان',
        'علویجه',
        'دهق',
        'نطنز',
        'طرق رود',
        'بادرود',
        'خالد آباد',
        'سمیرم',
        'حنا',
        'ونک',
        'کمه',
        'بیده',
        'فتح آباد',
        'زرین شهر',
        'چمگردان',
        'سده لنجان',
        'ورنامخواست',
        'زاینده رود',
        'باغ بهادران',
        'چرمهین',
        'فولادشهر',
        'باغشاد',
        'خوانسار',
        'ویست',
        'فریدونشهر',
        'برف انبار',
        'خمینی شهر',
        'درچه',
        'کوشک',
        'اصغر آباد',
        'فلاورجان',
        'کلیشادوسودرجان',
        'ابریشم',
        'اشترجان',
        'مینادشت',
        'بوستان زر',
        'پیربکران',
        'بهاران شهر',
        'طاد',
        'قهدریجان',
        'زازران',
        'میمه',
        'وزوان',
        'لای بید',
        'گزبرخوار',
        'شاهین شهر',
        'گرگاب',
        'مبارکه',
        'دیزیچه',
        'طالخونچه',
        'کرکوند',
        'شهر جدید مجلسی',
        'زیباشهر',
        'دهسرخ',
        'آران وبیدگل',
        'نوش آباد',
        'سفید شهر',
        'ابوزید آباد',
        'تیران',
        'رضوانشهر',
        'عسگران',
        'چادگان',
        'رزوه',
        'دهاقان',
        'گلشن',
        'دستگرد',
        'خورزوق',
        'دولت آباد',
        'سین',
        'حبیب آباد',
        'کمشجه',
        'شاپور آباد',
        'خور',
        'جندق',
        'فرخی',
        'بوئین ومیاندشت',
        'افوس',
        'نیک آباد',
        'محمدآباد',
        'نصرآباد',
        'حسن آباد',
        'کوهپایه',
        'تودشک',
        'سگزی',
        'هرند',
        'اژیه',
        'ورزنه',
        'کدکن',
        'تربت حیدریه',
        'بایک',
        'رباط سنگ',
        'نسر',
        'سبزوار',
        'روداب',
        'باجگیران',
        'قوچان',
        'مزرج',
        'آلماجق',
        'شهرکهنه',
        'گناباد',
        'بیدخت',
        'روشناوند',
        'کاخک',
        'ملک آباد',
        'مشهد',
        'رضویه',
        'چکنه',
        'نیشابور',
        'بار',
        'عشق آباد',
        'کاشمر',
        'لطف آباد',
        'درگز',
        'چاپشلو',
        'نوخندان',
        'تربت جام',
        'نصر آباد',
        'نیل شهر',
        'احمد آباد صولت',
        'سمیع آباد',
        'تایباد',
        'کاریز',
        'مشهد ریزه',
        'خواف',
        'نشتیفان',
        'سنگان',
        'قاسم آباد',
        'سلامی',
        'سده',
        'سرخس',
        'مزدآوند',
        'چناران',
        'سید آباد',
        'رادکان',
        'فریمان',
        'فرهادگرد',
        'قلندرآباد',
        'سفید سنگ',
        'بردسکن',
        'انابد',
        'شهر آباد',
        'رشتخوار',
        'جنگل',
        'کلات',
        'شهر زو',
        'چنار',
        'حسن آباد',
        'خلیل آباد',
        'کندر',
        'فیض آباد',
        'شادمهر',
        'بجستان',
        'یونسی',
        'طرقبه',
        'شاندیز',
        'جغتای',
        'ریواده',
        'نقاب',
        'حکم آباد',
        'فیروزه',
        'همت آباد',
        'گرماب',
        'دولت آباد',
        'چخماق',
        'باخرز',
        'قلعه نو علیا',
        'سلطان آباد',
        'مشکان',
        'نوده انقلاب',
        'داورزن',
        'ریوند',
        'صالح آباد',
        'جنت آباد',
        'ریوش',
        'درود',
        'قدمگاه',
        'خرو',
        'اسحاق آباد',
        'ششتمد',
        'گلبهار',
        'گلمکان',
        'اهواز',
        'الهائی',
        'بهبهان',
        'منصوریه',
        'سردشت',
        'تشان',
        'خرمشهر',
        'مقاومت',
        'مینوشهر',
        'اروند کنار',
        'آبادان',
        'چوئبده',
        'بستان',
        'سوسنگرد',
        'ابوحمیظه',
        'کوت سید نعیم',
        'دزفول',
        'شهرامام',
        'صفی آباد',
        'میانرود',
        'شمس آباد',
        'سیاه منصور',
        'منتظران',
        'سالند',
        'حمزه',
        'چغامیش',
        'جندی شاپور',
        'شهیون',
        'شوشتر',
        'شرافت',
        'سرداران',
        'گوریه',
        'عرب حسن',
        'مسجد سلیمان',
        'گلگیر',
        'عنبر',
        'ایذه',
        'رامهرمز',
        'باوج',
        'رودزرد ماشین',
        'سلطان آباد',
        'بندر امام خمینی',
        'بندر ماهشهر',
        'چمران',
        'شادگان',
        'خنافره',
        'دارخوین',
        'اندیمشک',
        'آزادی',
        'چم گلک',
        'حسینیه',
        'بیدروبه',
        'شوش',
        'حر',
        'فتح المبین',
        'باغ ملک',
        'صیدون',
        'میداود',
        'قلعه تل',
        'جایزان',
        'امیدیه',
        'میانکوه',
        'لالی',
        'هندیجان',
        'زهره',
        'رامشیر',
        'مشراگه',
        'گتوند',
        'صالح شهر',
        'جنت مکان',
        'ترکالکی',
        'سماله',
        'قلعه خواجه',
        'آبژدان',
        'زاووت',
        'هویزه',
        'رفیع',
        'هفتگل',
        'ملاثانی',
        'شیبان',
        'ویس',
        'آغاجاری',
        'جولکی',
        'حمیدیه',
        'کوت عبدالله',
        'شاوور',
        'الوان',
        'دهدز',
        'آباده',
        'ایزدخواست',
        'سورمق',
        'صغاد',
        'بهمن',
        'شیراز',
        'داریان',
        'شهر جدید صدرا',
        'خانه زنیان',
        'فسا',
        'ششده',
        'قره بلاغ',
        'زاهدشهر',
        'میانشهر',
        'نوبندگان',
        'جویم',
        'لار',
        'خور',
        'لطیفی',
        'دهکویه',
        'بیرم',
        'بنارویه',
        'عماد شهر',
        'فیروز آباد',
        'میمند',
        'جهرم',
        'دوزه',
        'قطب آباد',
        'کازرون',
        'کنار تخته',
        'بالاده',
        'خشت',
        'استهبان',
        'ایج',
        'رونیز',
        'داراب',
        'رستاق',
        'فدامی',
        'دوبرجی',
        'جنت شهر',
        'پاسخن',
        'مشکان',
        'نی ریز',
        'قطرویه',
        'نور آباد',
        'خومه زار',
        'بابا منیر',
        'اقلید',
        'سده',
        'دژکرد',
        'حسن آباد',
        'مرودشت',
        'زنگی آباد',
        'فتح آباد',
        'کامفیروز',
        'رامجرد',
        'سیدان',
        'فاروق',
        'خانمین',
        'اردکان',
        'هماشهر',
        'لامرد',
        'اشکنان',
        'اهل',
        'علامرودشت',
        'چاه ورز',
        'خیرگو',
        'بوانات',
        'مزایجان',
        'صفاشهر',
        'قادر آباد',
        'ارسنجان',
        'حاجی آباد',
        'دبیران',
        'شهر پیر',
        'قیر',
        'کارزین',
        'مبارک آباد',
        'امام شهر',
        'افزر',
        'مهر',
        'گله دار',
        'فال',
        'وراوی',
        'خوزی',
        'اسیر',
        'فراشبند',
        'نوجین',
        'دهرم',
        'خنج',
        'محمله',
        'سعادت شهر',
        'مادر سلیمان',
        'سروستان',
        'کوهنجان',
        'مصیری',
        'کوپن',
        'گراش',
        'ارد',
        'کوار',
        'مظفری',
        'اکبرآباد',
        'طسوج',
        'خرامه',
        'معزآباد جابری',
        'خیرآباد توللی',
        'سلطان شهر',
        'نودان',
        'قائمیه',
        'بیضا',
        'آباده طشک',
        'باب انار',
        'خاوران',
        'اوز',
        'کوره',
        'زرقان',
        'لپوئی',
        'کره ای',
        'حسامی',
        'بم',
        'بروات',
        'شهداد',
        'اندوهجرد',
        'ماهان',
        'جوپار',
        'محی آباد',
        'کرمان',
        'باغین',
        'زنگی آباد',
        'اختیارآباد',
        'راین',
        'گلباف',
        'چترود',
        'کاظم آباد',
        'سیرجان',
        'نجف شهر',
        'پاریز',
        'هماشهر',
        'خواجو شهر',
        'زیدآباد',
        'بلورد',
        'رفسنجان',
        'مس سرچشمه',
        'کشکوئیه',
        'بهرمان',
        'جوادیه الهیه',
        'صفائیه',
        'درب بهشت',
        'جیرفت',
        'علی آباد',
        'جبالبارز',
        'بلوک',
        'بافت',
        'بزنجان',
        'کشکوئیه',
        'زرند',
        'خانوک',
        'ریحان',
        'یزدان شهر',
        'سی ریز',
        'شهربابک',
        'خورسند',
        'خاتون آباد',
        'دهج',
        'جوزم',
        'بردسیر',
        'دشتکار',
        'لاله زار',
        'گلزار',
        'نگار',
        'کهنوج',
        'ده کهان',
        'چاه مرید',
        'هجدک',
        'راور',
        'منوجان',
        'نودژ',
        'عنبرآباد',
        'دوساری',
        'مردهک',
        'کوهبنان',
        'کیانشهر',
        'رودبار',
        'زهکلوت',
        'قلعه گنج',
        'چاه دادخدا',
        'رمشک',
        'محمدآباد',
        'رحمت آباد',
        'عباس آباد سردار',
        'گنبکی',
        'انار',
        'امین شهر',
        'فهرج',
        'دهنو اسلام آباد',
        'رابر',
        'هنزا',
        'نرماشیر',
        'نظام شهر',
        'فاریاب',
        'حور پاسفید',
        'ارزوئیه',
        'علی آباد',
        'اسلام آبادغرب',
        'حمیل',
        'کرمانشاه',
        'هلشی',
        'رباط',
        'کوزران',
        'قلعه',
        'سومار',
        'قصر شیرین',
        'پاوه',
        'باینگان',
        'بانوره',
        'نودشه',
        'نوسود',
        'سنقر',
        'سطر',
        'کنگاور',
        'گودین',
        'سرپل ذهاب',
        'گیلانغرب',
        'سرمست',
        'جوانرود',
        'شروینه',
        'صحنه',
        'میان راهان',
        'هرسین',
        'بیستون',
        'تازه آباد',
        'ازگله',
        'میرآباد',
        'روانسر',
        'شاهو',
        'کرند غرب',
        'ریجاب',
        'گهواره',
        'کوچصفهان',
        'لولمان',
        'رشت',
        'پیربازار',
        'لشت نشاء',
        'سنگر',
        'خشکبیجار',
        'بندر انزلی',
        'هشتپر',
        'لیسار',
        'اسالم',
        'حویق',
        'چوبر',
        'فومن',
        'ماسوله',
        'ماکلوان',
        'لاهیجان',
        'رودبنه',
        'رودسر',
        'رحیم آباد',
        'چابکسر',
        'کلاچای',
        'واجارگاه',
        'آستارا',
        'لوندویل',
        'لنگرود',
        'چاف و چمخاله',
        'اطاقور',
        'کومله',
        'شلمان',
        'رودبار',
        'منجیل',
        'لوشان',
        'رستم آباد',
        'جیرنده',
        'توتکابن',
        'بره سر',
        'صومعه سرا',
        'مرجقل',
        'گوراب زرمیخ',
        'آستانه اشرفیه',
        'کیاشهر',
        'شفت',
        'احمد سر گوراب',
        'رضوانشهر',
        'پره سر',
        'ماسال',
        'بازارجمعه',
        'املش',
        'رانکوه',
        'سیاهکل',
        'دیلمان',
        'خمام',
        'تنکابن',
        'شیرود',
        'نشتارود',
        'خرم آباد',
        'کیاسر',
        'ساری',
        'فریم',
        'پایین هولار',
        'آکند',
        'فرح آباد',
        'خوش رود پی',
        'امیرکلا',
        'بابل',
        'گلوگاه',
        'مرزی کلا',
        'زرگر',
        'گتاب',
        'قائم شهر',
        'ارطه',
        'رینه',
        'گزنک',
        'آمل',
        'دابودشت',
        'امامزاده عبدالله',
        'بابکان',
        'نوشهر',
        'پول',
        'کجور',
        'بهشهر',
        'رستمکلا',
        'خلیل شهر',
        'رویان',
        'نور',
        'ایزد شهر',
        'بلده',
        'چمستان',
        'رامسر',
        'کتالم وسادات شهر',
        'پل سفید',
        'آلاشت',
        'زیر آب',
        'بابلسر',
        'بهنمیر',
        'هادی شهر',
        'محمود آباد',
        'سرخرود',
        'نکا',
        'چالوس',
        'هچیرود',
        'مرزن آباد',
        'جویبار',
        'کوهی خیل',
        'گلوگاه',
        'فریدونکنار',
        'آستانه سرا',
        'عباس آباد',
        'سلمان شهر',
        'کلار آباد',
        'سورک',
        'طبق ده',
        'کیاکلا',
        'شیرگاه',
        'کلاردشت',
        'اراک',
        'داود آباد',
        'ساروق',
        'کارچان',
        'ساوه',
        'آوه',
        'غرق آباد',
        'نوبران',
        'محلات',
        'نیمور',
        'تفرش',
        'خمین',
        'قورچی باشی',
        'آشتیان',
        'دلیجان',
        'نراق',
        'شازند',
        'آستانه',
        'هندودر',
        'توره',
        'شهر جدید مهاجران',
        'شهباز',
        'مامونیه',
        'پرندک',
        'خشکرود',
        'رازقان',
        'زاویه',
        'کمیجان',
        'میلاجرد',
        'خنداب',
        'جاورسیان',
        'فرمهین',
        'خنجین',
        'تلخاب',
        'زابل',
        'بنجار',
        'زاهدان',
        'نصرت آباد',
        'سرجنگل',
        'بزمان',
        'ایرانشهر',
        'چاه بهار',
        'پلان',
        'سراوان',
        'گشت',
        'محمدی',
        'سیرکان',
        'اسفندک',
        'خاش',
        'اسماعیل آباد',
        'ده رئیس',
        'نیک شهر',
        'بنت',
        'چانف',
        'راسک',
        'پیشین',
        '‍‍‍‍‍‍‍‍‍‍‍‍‍‍‍‍‍‍‍‍‍‍‍پارود',
        'کنارک',
        'زهک',
        'جزینک',
        'گلمورتی',
        'چگرد',
        'سوران',
        'سیب',
        'هیدوچ',
        'مهرستان',
        'آشار',
        'دوست محمد',
        'قرقری',
        'قصر قند',
        'ساربوک',
        'میرجاوه',
        'ریگ ملک',
        'لادیز',
        'ادیمی',
        'محمد آباد',
        'علی اکبر',
        'فنوج',
        'گتیج',
        'بمپور',
        'محمدان',
        'قاسم آباد',
        'نوک آب',
        'سرباز',
        'نگور',
        'بریس',
        'جالق',
        'اسپکه',
        'زرآباد',
        'بیجار',
        'توپ آغاج',
        'بابار شانی',
        'پیر تاج',
        'یاسوکند',
        'سنندج',
        'شویشه',
        'حسین آباد',
        'سقز',
        'صاحب',
        'سنته',
        'بانه',
        'آرمرده',
        'کانی سور',
        'بوئین سفلی',
        'مریوان',
        'کانی دینار',
        'برده رشه',
        'چناره',
        'قروه',
        'دزج',
        'سریش آباد',
        'دلبران',
        'مالوجه',
        'دیواندره',
        'زرینه',
        'هزارکانیان',
        'کامیاران',
        'موچش',
        'سرو آباد',
        'اورامان تخت',
        'دهگلان',
        'بلبان آباد',
        'بندر عباس',
        'تازیان پائین',
        'فین',
        'تخت',
        'قلعه قاضی',
        'هرمز',
        'بندر لنگه',
        'کنگ',
        'چارک',
        'کیش',
        'لمزان',
        'میناب',
        'تیرور',
        'سندرک',
        'هشتبندی',
        'بندزرک',
        'زهوکی',
        'کرگان',
        'قشم',
        'درگهان',
        'رمکان',
        'سوزا',
        'طبل',
        'بندر لافت',
        'ابو موسی',
        'بندر جاسک',
        'لیردف',
        'دهبارز',
        'زیارتعلی',
        'بیکاه',
        'بالاشهر',
        'حاجی آباد',
        'فارغان',
        'سرگز',
        'بستک',
        'کوهیچ',
        'جناح',
        'هنگویه',
        'کوخردهرنگ',
        'پارسیان',
        'کوشکنار',
        'دشتی',
        'خمیر',
        'پل',
        'رویدر',
        'سیریک',
        'گروک',
        'کوهستک',
        'سردشت',
        'گوهران',
        'بوشهر',
        'شهر جدید عالیشهر',
        'خارک',
        'چغادک',
        'برازجان',
        'دالکی',
        'سعد آباد',
        'وحدتیه',
        'شبانکاره',
        'تنگ ارم',
        'کلمه',
        'بوشکان',
        'آبپخش',
        'اهرم',
        'آباد',
        'دلوار',
        'خورموج',
        'کاکی',
        'بادوله',
        'شنبه',
        'بندر کنگان',
        'بنک',
        'سیراف',
        'بندر گناوه',
        'بندر ریگ',
        'بندر دیر',
        'بردستان',
        'دوراهک',
        'بردخون',
        'آبدان',
        'بندر دیلم',
        'امام حسن',
        'جم',
        'بهارستان',
        'ریز',
        'انارستان',
        'عسلویه',
        'نخل تقی',
        'بیدخون',
        'چاه مبارک',
        'شهر کرد',
        'هفشجان',
        'کیان',
        'طاقانک',
        'نافچ',
        'سورشجان',
        'سودجان',
        'هارونی',
        'فرخ شهر',
        'بروجن',
        'فرادنبه',
        'سفید دشت',
        'نقنه',
        'گندمان',
        'بلداجی',
        'فارسان',
        'گوجان',
        'بابا حیدر',
        'فیل آباد',
        'جونقان',
        'پردنجان',
        'چلیچه',
        'لردگان',
        'مال خلیفه',
        'منج',
        'سردشت لردگان',
        'اردل',
        'دشتک',
        'کاج',
        'سرخون',
        'چلگرد',
        'بازفت',
        'صمصامی',
        'شلمزار',
        'گهرو',
        'دستناء',
        'ناغان',
        'بن',
        'وردنجان',
        'یانچشمه',
        'سامان',
        'هوره',
        'آلونی',
        'زنجان',
        'نیک پی',
        'ارمغانخانه',
        'ابهر',
        'هیدج',
        'صائین قلعه',
        'قیدار',
        'سهرورد',
        'نوربهار',
        'کرسف',
        'گرماب',
        'زرین رود',
        'سجاس',
        'ماه نشان',
        'دندی',
        'زرین آباد',
        'حلب',
        'آب بر',
        'چورزق',
        'خرمدره',
        'سلطانیه',
        'بیرانشهر',
        'زاغه',
        'خرم آباد',
        'سپیددشت',
        'اشترینان',
        'ونایی',
        'بروجرد',
        'الیگودرز',
        'شول آباد',
        'تیتکان بزنوید',
        'چمن سلطان',
        'شاپور آباد',
        'نور آباد',
        'هفت چشمه',
        'برخوردار',
        'کوهدشت',
        'گراب',
        'کوهنانی',
        'درب گنبد',
        'دورود',
        'چالانچولان',
        'ازنا',
        'مومن آباد',
        'پلدختر',
        'سراب حمام',
        'معمولان',
        'الشتر',
        'فیروزآباد',
        'سراب دوره',
        'ویسیان',
        'چم پلک',
        'چقابل',
        'سوری',
        'ملایر',
        'اسلامشهر آق گل',
        'سامن',
        'ازندریان',
        'جوکار',
        'زنگنه',
        'همدان',
        'مریانج',
        'جورقان',
        'قهاوند',
        'نهاوند',
        'فیروزان',
        'برزول',
        'گیان',
        'تویسرکان',
        'سرکان',
        'فرسفج',
        'کبودر آهنگ',
        'گل تپه',
        'شیرین سو',
        'اسد آباد',
        'پالیز',
        'آجین',
        'بهار',
        'لالجین',
        'مهاجران',
        'صالح آباد',
        'رزن',
        'دمق',
        'فامنین',
        'قروه درگزین',
        'کرفس',
        'یزد',
        'شاهدیه',
        'زارچ',
        'خرانق',
        'اردکان',
        'احمد آباد',
        'عقدا',
        'بافق',
        'تفت',
        'نیر',
        'بخ',
        'مهریز',
        'میبد',
        'بفروئیه',
        'ندوشن',
        'ابرکوه',
        'مهردشت',
        'خضر آباد',
        'اشکذر',
        'مجومرد',
        'هرات',
        'بهاباد',
        'مروست',
        'ایلام',
        'جعفر آباد',
        'دره شهر',
        'ماژین',
        'دهلران',
        'موسیان',
        'پهله',
        'میمه',
        'صالح آباد',
        'مهران',
        'سرابله',
        'آسمان آباد',
        'بلاوه',
        'شباب',
        'آبدانان',
        'مورموری',
        'سراب باغ',
        'ایوان',
        'زرنه',
        'ارکواز',
        'دلگشا',
        'مهر',
        'لومار',
        'بدره',
        'چشمه شیرین',
        'توحید',
        'چوار',
        'سمنان',
        'شاهرود',
        'رویان',
        'بسطام',
        'مجن',
        'کلاته خیج',
        'بیارجمند',
        'دامغان',
        'دیباج',
        'کلاته',
        'امیریه',
        'ایوانکی',
        'گرمسار',
        'مهدی شهر',
        'درجزین',
        'شهمیرزاد',
        'میامی',
        'رضوان',
        'آرادان',
        'کهن آباد',
        'سرخه',
        'دهدشت',
        'قلعه رئیسی',
        'دیشموک',
        'سوق',
        'یاسوج',
        'مادوان',
        'گراب سفلی',
        'چیتاب',
        'دوگنبدان',
        'سی سخت',
        'پاتاوه',
        'لیکک',
        'سرآسیاب یوسفی',
        'قلعه ممبی',
        'باشت',
        'بوستان',
        'چرام',
        'سر فاریاب',
        'لنده',
        'مارگون',
        'تهران',
        'دماوند',
        'کیلان',
        'آبسرد',
        'رودهن',
        'آبعلی',
        'ورامین',
        'جوادآباد',
        'ری',
        'حسن آباد',
        'باقرشهر',
        'کهریزک',
        'قیامدشت',
        'قلعه نو',
        'تجریش',
        'لواسان',
        'فشم',
        'شمشک',
        'شهریار',
        'صباشهر',
        'شاهدشهر',
        'باغستان',
        'شهر جدید اندیشه',
        'وحیدیه',
        'فردوسیه',
        'اسلامشهر',
        'چهار دانگه',
        'احمدآباد مستوفی',
        'رباط کریم',
        'نصیرشهر',
        'شهر جدید پرند',
        'فیروزکوه',
        'ارجمند',
        'پاکدشت',
        'فرون آباد',
        'شریف آباد',
        'قدس',
        'ملارد',
        'صفادشت',
        'پیشوا',
        'جلیل آباد',
        'گلستان',
        'صالحیه',
        'نسیم شهر',
        'بومهن',
        'شهر جدید پردیس',
        'خسرو آباد',
        'سعید آباد',
        'قرچک',
        'اردبیل',
        'هیر',
        'آراللو',
        'ثمرین',
        'خلخال',
        'کلور',
        'هشتجین',
        'مشگین شهر',
        'آلنی',
        'رضی',
        'لاهرود',
        'فخرآباد',
        'مرادلو',
        'قصابه',
        'گرمی',
        'زهرا',
        'بیله سوار',
        'جعفرآباد',
        'پارس آباد',
        'اولتان',
        'مغانسر',
        'اسلام آباد',
        'نمین',
        'آبی بیگلو',
        'عنبران',
        'گیوی',
        'نیر',
        'کوراییم',
        'سرعین',
        'اردیموسی',
        'اصلاندوز',
        'انگوت',
        'دستجرد',
        'قم',
        'قنوات',
        'سلفچگان',
        'کهک',
        'جعفریه',
        'معلم کلایه',
        'سیردان',
        'قزوین',
        'اقبالیه',
        'محمودآبادنمونه',
        'رازمیان',
        'کوهین',
        'تاکستان',
        'نرجه',
        'ضیاءآباد',
        'خرمدشت',
        'اسفرورین',
        'بوئین زهرا',
        'سگز آباد',
        'عصمت آباد',
        'دانسفهان',
        'شال',
        'ارداق',
        'آبیک',
        'زیاران',
        'قشلاق',
        'خاکعلی',
        'الوند',
        'محمدیه',
        'بیدستان',
        'شریفیه',
        'آوج',
        'آبگرم',
        'گرگان',
        'جلین',
        'سرخنکلاته',
        'قرق',
        'اینچه برون',
        'کرند',
        'گنبد کاووس',
        'بندر ترکمن',
        'سیجوال',
        'علی آباد',
        'مزرعه',
        'سنگدوین',
        'فاضل آباد',
        'کرد کوی',
        'مینو دشت',
        'دوزین',
        'بندر گز',
        'نوکنده',
        'آق قلا',
        'انبارآلوم',
        'کلاله',
        'فراغی',
        'آزادشهر',
        'نگین شهر',
        'نوده خاندوز',
        'رامیان',
        'دلند',
        'تاتار علیا',
        'خان ببین',
        'مراوه تپه',
        'گلیداغ',
        'گمیش تپه',
        'سیمین شهر',
        'گالیکش',
        'صادق آباد',
        'بیرجند',
        'فردوس',
        'اسلامیه',
        'باغستان',
        'طبس',
        'عشق آباد',
        'دیهوک',
        'قائن',
        'اسفدن',
        'خضری دشت بیاض',
        'نیمبلوک',
        'آرین شهر',
        'نهبندان',
        'شوسف',
        'سربیشه',
        'مود',
        'درح',
        'اسدیه',
        'قهستان',
        'طبس مسینا',
        'گزیک',
        'سرایان',
        'آیسک',
        'سه قلعه',
        'بشرویه',
        'ارسک',
        'خوسف',
        'ماژان',
        'حاجی آباد',
        'زهان',
        'آبیز',
        'بجنورد',
        'چناران شهر',
        'حصارگرمخان',
        'صفی آباد',
        'اسفراین',
        'شیروان',
        'زیارت',
        'خانلق',
        'لوجلی',
        'قوشخانه',
        'جاجرم',
        'شوقان',
        'سنخواست',
        'آشخانه',
        'قاضی',
        'آوا',
        'پیش قلعه',
        'فاروج',
        'تیتکانلو',
        'درق',
        'ایور',
        'گرمه',
        'راز',
        'یکه سعود',
        'غلامان',
        'کرج',
        'ماهدشت',
        'کمال شهر',
        'محمد شهر',
        'گرمدره',
        'آسارا',
        'هشتگرد',
        'گلسار',
        'شهر جدید هشتگرد',
        'کوهسار',
        'نظر آباد',
        'تنکمان',
        'طالقان',
        'اشتهارد',
        'پلنگ آباد',
        'فردیس',
        'مشکین دشت',
        'چهار باغ',
      ],
      form: {
        schoolTitle: '',
      },
      delete_loading: false,
    }
  },
  head() {
    return {
      title: this.form.schoolTitle,
    }
  },
  mounted() {
    this.getInfo()
    // this.title=this.page_info.title;
    // this.describe=this.page_info.describe;
  },
  methods: {
    getInfo() {
      this.$fetch
        .$get(`/test_api/school_info/${this.$route.params.id}`)
        .then((response) => {
          this.form = response
        })
        .catch((_err) => {
          console.log(_err)
        })
    },
    async updatePage() {
      this.update_loading = true
      this.form.user_id = this.$auth.user.id
      await this.$fetch
        .$put('/test_api/school_update', this.form)
        .then((response) => {
          this.$toast.success('Page updated successfully')
          if (response == -1) this.$router.replace(`/school-list`)
          else this.$router.replace(`/school-list/edit/${response.Id}`)
        })
        .catch((_err) => {
          this.$toast.error('An error occurred during page creation.')
        })
        .finally((_msg) => {
          this.update_loading = false
        })
    },
    goBack() {
      this.$router.go(-1)
    },
    destroySchool() {
      this.$fetch
        .$delete(
          `/test_api/school_destroy/${this.form.Id}/${this.form.regionTitle}/${this.$auth.user.id}`,
        )
        .then((response) => {
          if (response == -1) this.$router.replace(`/school-list`)
          else this.$router.replace(`/school-list/edit/${response.Id}`)
        })
        .catch((_err) => {
          console.log(_err)
        })
    },
  },
}
</script>

<style scoped>
#school-list-edit {
  direction: rtl;
  font-family: "B Nazanin" !important;
  font-weight: 900;
  font-size: large !important;
}

.v-footer {
  display: none !important;
}

#footer-copy-right {
  display: none !important;
}
</style>
