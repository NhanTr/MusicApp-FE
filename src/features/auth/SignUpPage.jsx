import {FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Link} from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authApi } from "@/lib/api";

function SignUpPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const payload = {
                username,
                email,
                password,
            };

            await authApi.register(payload);
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
                    <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    />
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