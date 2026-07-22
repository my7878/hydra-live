"use client";

import { parsePhoneNumberFromString } from "libphonenumber-js";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
function generateTrackingId() {
  return (
    "HYD-" +
    Math.random().toString(36).substring(2, 6).toUpperCase() +
    Math.random().toString(36).substring(2, 6).toUpperCase()
  );
}

export default function OrderPage() {
  const searchParams = useSearchParams();
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  const [preview, setPreview] = useState("");
  const [agree, setAgree] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const defaultPlan = searchParams.get("plan") || "";
  const [passwordStrength, setPasswordStrength] = useState("");
  const [hasMinLength, setHasMinLength] = useState(false);
const [hasNumber, setHasNumber] = useState(false);
const [successMessage, setSuccessMessage] = useState("");
const [hasLetter, setHasLetter] = useState(false);
  const [name, setName] = useState("");
const [phone, setPhone] = useState("");
const [plan, setPlan] = useState(defaultPlan);
const [paymentMethod, setPaymentMethod] = useState("");
const [image, setImage] = useState<File | null>(null);
const [username, setUsername] = useState("");
const [userPassword, setUserPassword] = useState("");
const [usernameError, setUsernameError] = useState("");
const [checkingUsername, setCheckingUsername] = useState(false);
const [confirmPassword, setConfirmPassword] = useState("");
const [suggestions, setSuggestions] = useState<string[]>([]);
const [passwordMessage, setPasswordMessage] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [errorMessage, setErrorMessage] = useState("");
const [trackingId, setTrackingId] = useState("");
const [orderSent, setOrderSent] = useState(false);
async function checkUsernameAvailability(value: string){
  if (!value) {
    setUsernameError("");
    return;
  }

  setCheckingUsername(true);

  const { data, error } = await supabase
    .from("orders")
    .select("id")
    .eq("username", value)
    .limit(1);

  setCheckingUsername(false);

  if (error) return;

 if (data.length > 0) {
  setUsernameError("اسم المستخدم مستخدم بالفعل");

  setSuggestions([
    `${value}123`,
    `${value}2026`,
    `${value}1`,
    `${value}${Math.floor(Math.random() * 900 + 100)}`
  ]);
} else {
  setUsernameError("");
  setSuggestions([]);
}
}
async function handleSubmit(e: React.FormEvent) {
e.preventDefault();
setLoading(true);
setErrorMessage("");
setSuccessMessage("");
const newTrackingId = generateTrackingId();
 if (!agree) {
  setErrorMessage("يرجى الموافقة على الشروط.");
  setLoading(false);
  return;
} 
if (
    !name ||
    !phone ||
    !username ||
    !userPassword ||
    !confirmPassword ||
    !plan ||
    !paymentMethod
  ) {
    setErrorMessage("من فضلك أكمل جميع البيانات");
    setLoading(false);
    return;
  }

  if (userPassword !== confirmPassword) {
    setErrorMessage("كلمة المرور وتأكيد كلمة المرور غير متطابقين.");
    setLoading(false);
    return;
  }
if (usernameError) {
 setErrorMessage("يرجى اختيار اسم مستخدم آخر.");
  setLoading(false);
  return;
}
if (phoneValid === false) {
  setErrorMessage("يرجى إدخال رقم واتساب صحيح.");
  setLoading(false);
  return;
}
if (!image) {
  setErrorMessage("يرجى رفع صورة التحويل.");
  setLoading(false);
  return;
}
const phoneNumber = parsePhoneNumberFromString("+" + phone);

if (!phoneNumber || !phoneNumber.isValid()) {
  setErrorMessage("يرجى إدخال رقم واتساب صحيح.");
  setLoading(false);
  return;
}

const fullPhone = phoneNumber.number;
  let imageUrl = "";

if (image) {
  const fileName = `${Date.now()}-${image.name}`;

  const { error: uploadError } = await supabase.storage
    .from("payments")
    .upload(fileName, image);

  if (uploadError){
    setErrorMessage("فشل رفع الصورة");
    setLoading(false);
    console.error(uploadError);
    setLoading(false);
    return;
  }

  const { data } = supabase.storage
    .from("payments")
    .getPublicUrl(fileName);

  imageUrl = data.publicUrl;
}
  const { error } = await supabase.from("orders").insert([
  {
    name,
    phone: fullPhone,
    username,
    password: userPassword,
    plan,
    payment_method: paymentMethod,
    payment_image: imageUrl,
    status: "pending",
tracking_id: newTrackingId,  },
]);

if (error){
  console.log(error);
  setErrorMessage(error.message);
  setLoading(false);
  return;
}
setTrackingId(newTrackingId);
setOrderSent(true);

localStorage.setItem("tracking_id", newTrackingId);
setSuccessMessage("✅ تم إرسال طلبك بنجاح، سيتم مراجعته خلال دقائق.");
setLoading(false);
  
}
const paymentDetails = {
  "Vodafone Cash": {
    number: "01003284239",
    owner: "محمد ياسر",
  },
  Instapay: {
    number: "01003284239",
    owner: "محمد ياسر",
  },
};
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  } catch (error) {
    console.error(error);
  }
};
if (orderSent) {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-xl rounded-2xl border border-purple-700 bg-zinc-900 p-8 text-center">

        <div className="text-6xl">✅</div>

        <h1 className="mt-4 text-3xl font-bold text-green-400">
          تم إرسال طلبك بنجاح
        </h1>

        <p className="mt-4 text-gray-300">
          سيتم مراجعة الطلب وتفعيله في أقرب وقت.
        </p>

        <div className="mt-8 rounded-xl bg-zinc-800 p-5">
          <p className="text-gray-400">رقم متابعة الطلب</p>

          <h2 className="mt-2 text-2xl font-bold text-purple-400">
            {trackingId}
          </h2>

          <button
            onClick={() => navigator.clipboard.writeText(trackingId)}
            className="mt-4 rounded-lg bg-purple-600 px-5 py-2 hover:bg-purple-500"
          >
            📋 نسخ رقم المتابعة
          </button>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <a
            href="/track"
            className="rounded-lg bg-purple-600 py-3 font-bold hover:bg-purple-500"
          >
            📦 متابعة الطلب
          </a>

          <a
            href="/"
            className="rounded-lg border border-purple-600 py-3 hover:bg-purple-600"
          >
            🏠 العودة للرئيسية
          </a>
        </div>

      </div>
    </main>
  );
}
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl border border-purple-700 bg-zinc-900 p-8">
        <h1 className="text-center text-3xl font-bold text-purple-400">
          طلب اشتراك Hydra Live
        </h1>
{successMessage && (
  <div className="mb-4 rounded-lg bg-green-600 p-3 text-center">
    {successMessage}
  </div>
)}
{errorMessage && (
  <div className="mb-4 rounded-lg bg-red-600 p-3 text-center">
    {errorMessage}
  </div>
)}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            type="text"
            placeholder="الاسم"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg bg-zinc-800 p-3 outline-none"
          />

        <div className="phone-input">
  <PhoneInput
    country={"eg"}
    value={phone}
    onChange={(value) => {
  setPhone(value);

  const parsed = parsePhoneNumberFromString("+" + value);

if (!parsed) {
  setPhoneValid(false);
} else {
  const isValid =
    parsed.isPossible() &&
    parsed.isValid() &&
    parsed.nationalNumber.length >= 6;

  setPhoneValid(isValid);
}
}}
    enableSearch
    searchPlaceholder="ابحث عن الدولة..."
    placeholder="أدخل رقم الواتساب"
    inputStyle={{
      width: "100%",
      height: "50px",
      background: "#27272a",
      color: "#fff",
      border: "1px solid #6d28d9",
      borderRadius: "10px",
      paddingLeft: "55px",
    }}
    buttonStyle={{
      background: "#27272a",
      border: "1px solid #6d28d9",
      borderTopLeftRadius: "10px",
      borderBottomLeftRadius: "10px",
    }}
    dropdownStyle={{
      background: "#fafafa",
      color: "rgb(9, 9, 9)",
      border: "1px solid #6d28d9",
    }}
  />
  {phoneValid === true && (
  <p className="mt-2 text-green-500 text-sm">
    ✅ رقم الواتساب صحيح
  </p>
)}

{phoneValid === false && (
  <p className="mt-2 text-red-500 text-sm">
    ❌ رقم الواتساب غير صحيح
  </p>
)}
</div>
          
<input
  type="text"
  placeholder="اسم المستخدم"
  value={username}
 onChange={(e) => {
  const value = e.target.value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  setUsername(value);
}}
  onBlur={(e) => checkUsernameAvailability(e.target.value)}

  className="w-full rounded-lg bg-zinc-800 p-3 outline-none"
/>
{checkingUsername && (
  <p className="text-yellow-400 text-sm mt-1">
    جاري التحقق...
  </p>
)}

{suggestions.length > 0 && (
  <div className="mt-2 flex flex-wrap gap-2">
    {suggestions.map((item) => (
      <button
        key={item}
        type="button"
        onClick={() => {
          setUsername(item);
          setUsernameError("");
          setSuggestions([]);
        }}
        className="rounded-md bg-purple-700 px-3 py-1 text-sm hover:bg-purple-600"
      >
        {item}
      </button>
    ))}
  </div>
)}

{!checkingUsername && username && !usernameError && (
  <p className="text-green-500 text-sm mt-1">
    ✅ اسم المستخدم متاح
  </p>
)}

<div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="كلمة المرور"
    value={userPassword}
    onChange={(e) => {
  const value = e.target.value;
setUserPassword(value);
setHasMinLength(value.length >= 8);
setHasNumber(/[0-9]/.test(value));
setHasLetter(/[a-z]/.test(value));
if (
  value.trim().toLowerCase() === username.trim().toLowerCase() &&
  value !== ""
) {
  setPasswordError("❌ لا يمكن أن تكون كلمة المرور هي نفسها اسم المستخدم");
} else {
  setPasswordError("");
}
  if (value.length < 6) {
    setPasswordStrength("🔴 ضعيفة");
  } else if (
    value.length >= 8 &&
    /[0-9]/.test(value) &&
    /[a-z]/.test(value)
  ) {
    setPasswordStrength("🟢 قوية");
  } else {
    setPasswordStrength("🟡 متوسطة");
  }
}}
    className="w-full rounded-lg bg-zinc-800 p-3 pr-12 outline-none"
  />
{userPassword && (
  <p
    className={`mt-1 text-sm ${
      passwordStrength.includes("🟢")
        ? "text-green-500"
        : passwordStrength.includes("🟡")
        ? "text-yellow-400"
        : "text-red-500"
    }`}
  >
    قوة كلمة المرور: {passwordStrength}
  </p>
)}
{passwordError && (
  <p className="mt-1 text-sm text-red-500">
    {passwordError}
  </p>
)}
{userPassword && (
  <div className="mt-2 text-sm space-y-1">

    <p className={hasMinLength ? "text-green-500" : "text-red-500"}>
      {hasMinLength ? "✅" : "❌"} 8 أحرف على الأقل
    </p>

    <p className={hasNumber ? "text-green-500" : "text-red-500"}>
      {hasNumber ? "✅" : "❌"} تحتوي على رقم
    </p>

    <p className={hasLetter ? "text-green-500" : "text-red-500"}>
      {hasLetter ? "✅" : "❌"} تحتوي علي احرف انجليزي صغيره فقط
    </p>

  </div>
)}
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
  >
    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
  </button>
</div>

<div className="relative">
  <input
    type={showConfirmPassword ? "text" : "password"}
    placeholder="تأكيد كلمة المرور"
    value={confirmPassword}
    onChange={(e) => {
      const value = e.target.value;
      setConfirmPassword(value);

      if (!userPassword) {
        setPasswordMessage("");
      } else if (value === userPassword) {
        setPasswordMessage("✅ كلمة المرور متطابقة");
      } else {
        setPasswordMessage("❌ كلمة المرور غير متطابقة");
      }
    }}
    className="w-full rounded-lg bg-zinc-800 p-3 pr-12 outline-none"
  />

  <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
  >
    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
  </button>
</div>

{passwordMessage && (
  <p
    className={`mt-1 text-sm ${
      passwordMessage.includes("✅")
        ? "text-green-500"
        : "text-red-500"
    }`}
  >
    {passwordMessage}
  </p>
)}

  

          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="w-full rounded-lg bg-zinc-800 p-3 outline-none"
          >
            <option value="">اختر الباقة</option>
            <option value="24">24 شهر + 6 شهور هدية</option>
            <option value="12">12 شهر + 3 شهور هدية</option>
            <option value="6">6 شهور + شهر هدية</option>
            <option value="3">3 شهور</option>
          </select>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full rounded-lg bg-zinc-800 p-3 outline-none"
          >
            <option value="">طريقة الدفع</option>
            <option value="Instapay">Instapay</option>
            <option value="Vodafone Cash">Vodafone Cash</option>
          </select>
          {paymentMethod && (
  <div className="mt-4 rounded-xl border border-purple-700 bg-zinc-800 p-4">
    <h3 className="text-lg font-bold text-purple-400 mb-3">
      💳 بيانات الدفع
    </h3>

    <p className="mb-2">
      <span className="font-bold">رقم التحويل:</span>{" "}
      {paymentDetails[paymentMethod as keyof typeof paymentDetails].number}
    </p>
<button
  type="button"
  onClick={() =>
    copyToClipboard(
      paymentDetails[paymentMethod as keyof typeof paymentDetails].number
    )
  }
  className={`mt-3 rounded-lg px-4 py-2 font-bold transition-all duration-300 ${
    copied
      ? "bg-green-600 text-white"
      : "bg-purple-600 hover:bg-purple-500 text-white"
  }`}
>
  {copied ? "✅ تم النسخ" : "📋 نسخ الرقم"}
</button>

    <p>
      <span className="font-bold">اسم المستلم:</span>{" "}
      {paymentDetails[paymentMethod as keyof typeof paymentDetails].owner}
    </p>
  </div>
)}
          <input
  type="file"
  accept="image/*"
onChange={(e) => {
  if (!e.target.files?.length) return;

  const file = e.target.files[0];

  if (!file.type.startsWith("image/")) {
    setErrorMessage("يرجى اختيار صورة فقط.");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    setErrorMessage("حجم الصورة يجب ألا يتجاوز 5MB.");
    return;
  }

  setErrorMessage("");
  setImage(file);
  setPreview(URL.createObjectURL(file));
}}
  className="w-full rounded-lg bg-zinc-800 p-3"
/>

{image && (
  <div className="mt-2">
    <p className="text-green-400 text-sm">
      ✅ {image.name}
      </p>
      <p className="text-xs text-gray-400">
  {(image.size / 1024 / 1024).toFixed(2)} MB
</p>
      {preview && (
  <img
    src={preview}
    alt="Preview"
className="mt-3 h-36 w-full rounded-lg border border-purple-700 object-contain"  />
)}


    <button
      type="button"
onClick={() => {
  setImage(null);
  setPreview("");
}}      className="mt-2 text-red-500 hover:text-red-400 text-sm"
    >
      🗑️ حذف الصورة
    </button>
  </div>
)}
<label className="flex items-center gap-2 text-sm">
  <input
    type="checkbox"
    checked={agree}
    onChange={(e) => setAgree(e.target.checked)}
  />
  أتعهد أن بيانات الدفع صحيحة، وسيتم مراجعة الطلب قبل التفعيل.
</label>

<button
  type="submit"
  disabled={loading}
  className={`w-full rounded-lg py-3 font-bold transition ${
    loading
      ? "bg-gray-600 cursor-not-allowed"
      : "bg-purple-600 hover:bg-purple-500"
  }`}
>
  {loading ? "⏳ جارٍ إرسال الطلب..." : "🚀 إرسال الطلب"}
</button>
<a
  href="/"
  className="block w-full rounded-lg border border-purple-600 py-3 text-center font-bold transition hover:bg-purple-600"
>
  🏠 العودة إلى الصفحة الرئيسية
</a>
<p className="mt-3 text-center text-sm text-gray-400">
⏱️ متوسط وقت التفعيل من 5 إلى 15 دقيقة خلال ساعات العمل.
</p>
       </form>
</div>

<a
  href="https://wa.me/201278470969"
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full bg-green-600 px-5 py-3 text-white font-bold shadow-lg transition hover:bg-green-500 hover:scale-105"
>
  <FaWhatsapp /> واتساب
</a>

</main>
  );
}