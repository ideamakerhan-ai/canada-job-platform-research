# 캐나다 구인구직 사이트 법규 요구사항

## 📋 개요

캐나다의 구인구직 사이트는 **연방(Federal)** 및 **주(Provincial)** 차원의 고용 기준법을 모두 준수해야 합니다. 현재 가장 엄격한 규정은 **온타리오주(Ontario)**에서 2026년 1월 1일부터 시행되고 있습니다.

---

## 🏛️ 온타리오주(Ontario) - 가장 엄격한 규정 (2026년 1월 1일 시행)

### 적용 대상
- **직원 25명 이상**의 고용주가 공개적으로 광고하는 공고
- 온타리오주에서 근무하는 직책

### 필수 요구사항

#### 1️⃣ **급여 공개 의무 (Compensation Disclosure)**
- ✅ **모든 공고에 급여 또는 급여 범위를 명시해야 함**
- 범위 차이: 최대 $50,000/년 이내
- 예외: 연봉 $200,000 이상인 직책은 공개 불필요
- **현재 사이트 상태**: ❌ 급여 범위가 샘플 데이터에만 있음 → **필수 수정**

#### 2️⃣ **캐나다 경력 요구 금지 (No Canadian Experience Requirements)**
- ✅ **공고에서 "캐나다 경력 필수" 요구 불가**
- 지원 양식에서도 이 요구사항 제거 필수
- **현재 사이트 상태**: ✅ 문제 없음

#### 3️⃣ **AI 사용 공개 의무 (AI Disclosure)**
- ✅ **AI를 사용하여 지원자를 스크린, 평가, 선택하면 반드시 공개**
- 정의: "기계 기반 시스템으로 입력받은 데이터를 분석하여 예측, 콘텐츠, 추천, 결정을 생성하는 것"
- **현재 사이트 상태**: ❌ AI 사용 공개 필드 없음 → **필수 추가**

#### 4️⃣ **공석 상태 공개 (Vacancy Status Disclosure)**
- ✅ **공고가 "기존 공석"인지 "향후 예정"인지 명시**
- 예: "This posting is for an existing vacancy" 또는 "This posting is for a future vacancy"
- **현재 사이트 상태**: ❌ 공석 상태 필드 없음 → **필수 추가**

#### 5️⃣ **면접 후 통보 의무 (Post-Interview Notification)**
- ✅ **면접 후 45일 이내에 채용 결정 여부를 지원자에게 통보**
- 방법: 대면, 서면, 기술 이용 (이메일, 전화 등)
- **현재 사이트 상태**: ❌ 자동 통보 시스템 없음 → **필수 구현**

#### 6️⃣ **기록 보관 의무 (3년 보관)**
- ✅ **모든 공고, 지원 양식, 면접 후 통보 기록을 3년 보관**
- **현재 사이트 상태**: ✅ 데이터베이스에 저장되므로 가능

---

## 🌍 구인구직 플랫폼 운영자 의무 (Job Posting Platforms)

귀 사이트는 "공고 플랫폼"으로 분류되므로 다음 의무가 있습니다:

### 필수 요구사항

#### 1️⃣ **사기성 공고 신고 메커니즘**
- ✅ 사용자가 사기성 공고를 신고할 수 있는 방법 제공
- 신고 절차를 명확하게 공개

#### 2️⃣ **사기성 공고 정책 수립**
- ✅ 서면 정책 작성 및 공개
- 신고 처리 절차 명시

#### 3️⃣ **정책 공개**
- ✅ 신고 메커니즘과 정책을 사용자가 쉽게 접근할 수 있는 곳에 표시
- 예: 사이트 하단, FAQ, 헬프 센터

#### 4️⃣ **정책 보관**
- ✅ 정책이 폐지된 후 3년간 보관

---

## 📍 다른 주(Province)의 규정

### 브리티시컬럼비아(BC)
- 현재 온타리오주 수준의 엄격한 규정 없음
- 하지만 향후 유사 규정 도입 가능성 높음

### 앨버타(Alberta)
- 현재 온타리오주 수준의 엄격한 규정 없음

### 연방 (Federal)
- **Canada Labour Code Part III** 준수 필요
- 연방 관할 산업: 은행, 통신, 운송, 우편 등
- 고용 기록 보관, 최저임금, 초과근무 규정 등

---

## 🔴 현재 사이트의 필수 수정 사항

### 우선순위 1 (즉시 필수)

| 항목 | 현재 상태 | 필수 조치 | 마감 |
|------|---------|---------|------|
| **급여 공개** | ❌ 없음 | 모든 공고에 급여 또는 범위 추가 | 2026년 1월 1일 |
| **AI 사용 공개** | ❌ 없음 | AI 사용 여부 체크박스 추가 | 2026년 1월 1일 |
| **공석 상태** | ❌ 없음 | "기존 공석" vs "향후 예정" 선택 필드 추가 | 2026년 1월 1일 |
| **면접 후 통보** | ❌ 없음 | 자동 이메일 시스템 구현 (45일 이내) | 2026년 1월 1일 |
| **사기성 공고 신고** | ❌ 없음 | 신고 버튼/폼 추가 | 즉시 |

### 우선순위 2 (권장)

| 항목 | 현재 상태 | 권장 조치 |
|------|---------|---------|
| **약관/정책** | ⚠️ 기본만 있음 | 사기 공고 정책, 데이터 보호 정책 상세화 |
| **고용주 검증** | ❌ 없음 | 고용주 이메일 검증 시스템 추가 |
| **기록 보관** | ✅ 자동 | 3년 보관 정책 명시 |

---

## 📝 구현 로드맵

### Phase 1: 온타리오주 필수 규정 (2주)
1. PostJob.tsx에 다음 필드 추가:
   - 급여 또는 급여 범위 (필수)
   - AI 사용 여부 (체크박스)
   - 공석 상태 (라디오 버튼: 기존 공석 / 향후 예정)

2. 데이터베이스 스키마 업데이트:
   ```sql
   ALTER TABLE job_postings ADD COLUMN salary_min INT;
   ALTER TABLE job_postings ADD COLUMN salary_max INT;
   ALTER TABLE job_postings ADD COLUMN uses_ai BOOLEAN DEFAULT FALSE;
   ALTER TABLE job_postings ADD COLUMN vacancy_status ENUM('existing', 'future');
   ```

3. 면접 후 통보 시스템:
   - job_posting_applications 테이블에 `interview_date`, `notification_sent_date` 필드 추가
   - 45일 이내 자동 이메일 발송 스케줄러 구현

### Phase 2: 플랫폼 운영자 의무 (1주)
1. 사기성 공고 신고 기능:
   - 각 공고 카드에 "Report" 버튼 추가
   - 신고 폼: 신고 사유, 설명, 신고자 이메일

2. 정책 페이지:
   - /policies 또는 /terms 페이지에 "Fraudulent Job Posting Policy" 추가
   - 신고 방법 명시

3. 데이터베이스:
   ```sql
   CREATE TABLE job_posting_reports (
     id INT PRIMARY KEY AUTO_INCREMENT,
     job_posting_id INT,
     reporter_email VARCHAR(255),
     reason VARCHAR(255),
     description TEXT,
     created_at TIMESTAMP,
     status ENUM('pending', 'reviewed', 'removed') DEFAULT 'pending'
   );
   ```

### Phase 3: 고용주 검증 (1주)
1. 이메일 검증:
   - 고용주가 공고 작성 시 이메일 확인 링크 발송
   - 확인 후에만 공고 게시 가능

2. 고용주 프로필:
   - 회사명, 웹사이트, 연락처 정보 저장

---

## ⚖️ 법적 위험 및 벌칙

### 고용주 위반 시
- **Ontario**: 고용기준법 위반으로 최대 벌금 및 소송

### 플랫폼 운영자 위반 시
- 사기성 공고 신고 메커니즘 미제공: 규제 조치
- 정책 미공개: 사용자 신뢰 손상

---

## 📚 참고 자료

1. **온타리오주 공식 자료**
   - [Ontario Employment Standards Act](https://www.ontario.ca/laws/statute/000e14)
   - [Working for Workers Acts](https://www.ontario.ca/page/working-workers-legislation)

2. **연방 자료**
   - [Canada Labour Code Part III](https://laws-lois.justice.gc.ca/eng/acts/L-2/)
   - [Employment Standards Compliance](https://www.canada.ca/en/employment-social-development/corporate/portfolio/labour/programs/labour-standards/)

3. **법률 자문**
   - Hicks Morley (온타리오 노동법 전문)
   - Littler Mendelson (캐나다 고용법 전문)

---

## 🎯 결론

**귀 사이트는 온타리오주 규정을 기준으로 설계해야 합니다.** 온타리오주가 가장 엄격하므로, 이를 준수하면 다른 주에서도 대부분 문제없을 것입니다.

**즉시 구현 필수:**
1. ✅ 급여 공개 필드 추가
2. ✅ AI 사용 공개 필드 추가
3. ✅ 공석 상태 필드 추가
4. ✅ 면접 후 통보 시스템
5. ✅ 사기성 공고 신고 메커니즘

이 항목들을 구현하면 **2026년 1월 1일부터 온타리오주 규정을 완전히 준수**할 수 있습니다.
