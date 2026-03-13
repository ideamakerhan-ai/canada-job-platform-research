import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function PostJobCompliance() {
  const [, setLocation] = useLocation();
  const [agreed, setAgreed] = useState(false);

  const requirements = [
    {
      title: "급여 공개 의무",
      description: "모든 공고에 급여 또는 급여 범위를 명시해야 합니다.",
      details: "범위 차이는 최대 $50,000/년 이내여야 합니다. 연봉 $200,000 이상은 예외입니다.",
      icon: "💰",
    },
    {
      title: "AI 사용 공개",
      description: "AI를 사용하여 지원자를 평가하면 반드시 공개해야 합니다.",
      details: "지원자 스크린, 평가, 선택 과정에 AI를 사용하는 경우 명시하세요.",
      icon: "🤖",
    },
    {
      title: "공석 상태 표시",
      description: "공고가 기존 공석인지 향후 예정인지 명시해야 합니다.",
      details: "예: '기존 공석' 또는 '향후 예정 공석'",
      icon: "📋",
    },
    {
      title: "면접 후 통보",
      description: "면접을 본 지원자에게 45일 이내에 채용 결정 여부를 통보해야 합니다.",
      details: "이메일, 전화, 대면 등 어떤 방식으로든 가능합니다.",
      icon: "📧",
    },
    {
      title: "캐나다 경력 요구 금지",
      description: "공고에서 '캐나다 경력 필수'를 요구할 수 없습니다.",
      details: "국제 인재를 차별하지 않도록 주의하세요.",
      icon: "🌍",
    },
  ];

  const handleContinue = () => {
    if (agreed) {
      setLocation("/post-job");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">공고 등록 전 필수 안내</h1>
          <p className="text-lg text-slate-600">
            캐나다 고용 기준법을 준수하기 위해 다음 사항을 확인하세요.
          </p>
        </div>

        {/* Alert Box */}
        <Card className="border-amber-200 bg-amber-50 mb-8">
          <CardContent className="pt-6 flex gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">법규 준수 필수</h3>
              <p className="text-sm text-amber-800">
                온타리오주 및 캐나다 연방 고용 기준법을 준수하지 않으면 법적 책임을 질 수 있습니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Requirements Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {requirements.map((req, idx) => (
            <Card key={idx} className="hover:shadow-lg transition">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{req.icon}</span>
                  <div>
                    <CardTitle className="text-lg">{req.title}</CardTitle>
                    <CardDescription>{req.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">{req.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Checklist */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>체크리스트</CardTitle>
            <CardDescription>공고 등록 전 다음을 확인하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "급여 또는 급여 범위를 명시했습니다",
              "AI를 사용하는 경우 공개했습니다",
              "공석 상태(기존/향후)를 표시했습니다",
              "캐나다 경력 요구 조건을 제거했습니다",
              "면접 후 지원자에게 통보할 준비가 되어있습니다",
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-slate-700">{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Agreement */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 mt-1 rounded border-slate-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-slate-700">
                위의 모든 요구사항을 이해했으며, 캐나다 고용 기준법을 준수하겠습니다.
              </span>
            </label>
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => setLocation("/")}
            className="px-8"
          >
            돌아가기
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!agreed}
            className="px-8 bg-red-600 hover:bg-red-700"
          >
            공고 등록하기
          </Button>
        </div>

        {/* Footer Info */}
        <div className="mt-12 p-6 bg-white rounded-lg border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-3">더 알아보기</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              📄{" "}
              <a
                href="/LEGAL_COMPLIANCE_REQUIREMENTS.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:underline"
              >
                상세 법규 가이드
              </a>
            </li>
            <li>
              🔗{" "}
              <a
                href="https://www.ontario.ca/laws/statute/000e14"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:underline"
              >
                온타리오 고용기준법
              </a>
            </li>
            <li>
              🇨🇦{" "}
              <a
                href="https://laws-lois.justice.gc.ca/eng/acts/L-2/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:underline"
              >
                캐나다 노동법
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
