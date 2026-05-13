import {FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Link} from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, MailCheck } from "lucide-react";
import { authApi } from "@/lib/api";

function SignUpPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [otpSent, setOtpSent] = useState(false);

    const handleSendOtp = async () => {
        if (!email) {
            setError("Vui lòng nhập email trước khi gửi OTP.");
            return;
        }

        setIsSendingOtp(true);
        setError(null);
        setSuccess(null);

        try {
            const message = await authApi.requestRegisterOtp({ email });
            setOtpSent(true);
            setSuccess(message || "Đã gửi OTP tới email của bạn.");
        } catch (err) {
            setError(err.message || "Không gửi được OTP. Vui lòng thử lại.");
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const payload = {
                username,
                email,
                password,
                otp,
            };

            await authApi.register(payload);
            setSuccess("Đăng ký thành công. Bạn có thể đăng nhập ngay bây giờ.");
        } catch (err) {
            setError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
            <div className="flex items-center justify-center p-4 pt-10">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-red-600 mb-2">MusicFlow</h1>
                <p className="text-gray-600">Đăng ký để bắt đầu phát nhạc</p>
                </div>

                <form onSubmit={handleSignup} method="post" className="space-y-6">
                <FieldGroup>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input
                    id="username"
                    type="text"
                    placeholder="your_username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    required
                    />
                </FieldGroup>

                <FieldGroup>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <div className="flex gap-2">
                        <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading || isSendingOtp}
                        required
                        />
                        <Button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={isLoading || isSendingOtp}
                            className="bg-slate-900 text-white hover:bg-slate-800"
                        >
                            {isSendingOtp ? 'Đang gửi...' : 'Gửi OTP'}
                        </Button>
                    </div>
                </FieldGroup>

                <FieldGroup>
                    <FieldLabel htmlFor="otp">Mã OTP</FieldLabel>
                    <Input
                        id="otp"
                        type="text"
                        placeholder="Nhập mã OTP gồm 6 số"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        disabled={isLoading}
                        required
                    />
                    {otpSent && (
                        <p className="mt-2 text-xs text-emerald-700 flex items-center gap-1">
                            <MailCheck size={14} /> OTP đã được gửi. Kiểm tra hộp thư của bạn.
                        </p>
                    )}
                </FieldGroup>

                <FieldGroup>
                    <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                    <div className="relative">
                        <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        className="pr-11"
                        required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                            disabled={isLoading}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </FieldGroup>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                    </div>
                )}

                {success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded">
                    {success}
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition"
                    disabled={isLoading}
                >
                    {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                </Button>
                </form>

                <p className="text-center mt-6 text-gray-600">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-red-600 hover:text-red-700 font-semibold">
                    Đăng nhập
                </Link>
                </p>
            </div>
            </div>
        </div>
    );
}

export default SignUpPage;