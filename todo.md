# LMIAJobsCanada Project TODO

## Phase 1: 한국 산업 분류 카테고리 추가
- [x] 18개 한국 산업 분류 카테고리를 플랫폼에 추가
- [x] 샘플 데이터 업데이트 (각 카테고리별 공고)
- [x] 카테고리 드롭다운 UI 업데이트

## Phase 2: 검색 및 필터 기능 개선
- [ ] 고급 검색 기능 (NOC, TEER, LMIA 필터)
- [ ] 카테고리별 공고 수 표시
- [ ] 검색 결과 정렬 기능 (최신순, 급여순, 인기순)

## Phase 3: 도시별 페이지 구현
- [ ] Cities 페이지 생성
- [ ] 도시별 공고 수, 평균 임금, 수요 직종 표시
- [ ] 도시별 라우팅 추가

## Phase 4: 최종 테스트 및 배포
- [ ] 전체 기능 테스트
- [ ] 성능 최적화
- [ ] 최종 배포

## Completed
- [x] LMIAJobsCanada 기본 구조 완성
- [x] NOC Occupations 페이지 구현
- [x] Post a Job 기능 구현
- [x] Profile 페이지 구현

## Phase 5: LMIA 및 비자 스폰서십 배지 추가
- [x] 샘플 데이터에 LMIA 및 비자 스폰서십 정보 추가
- [x] 공고 카드에 LMIA/비자 스폰서십 배지 표시
- [x] 배지 스타일 및 위치 최적화

## Phase 6: Post a Job 등록 폼 개선
- [x] LMIA/비자 스폰서십 선택 기능 추가
- [x] 시급/연봉 입력 필드 추가 (숫자만 입력 가능)
- [x] 경력 요구사항 선택 기능 추가
- [x] 폼 유효성 검사 및 필수 필드 설정

## Phase 7: Accommodation (숭박) 옵션 추가
- [x] Post a Job 폼에 Accommodation 체크박스 추가
- [x] 샘플 데이터에 Accommodation 정보 추가
- [x] 공고 카드에 Accommodation 배지 표시

## Phase 8: Post a Job 공고 저장 및 표시 기능
- [x] Post a Job 폼 데이터를 데이터베이스에 저장
- [x] 홈페이지에서 저장된 공고 표시
- [x] 공고 필터링 시 저장된 공고 포함

## Phase 9: 버그 수정
- [x] getJobListings 함수의 where 절 쿼리 에러 해결 (and 연산자 추가)

## Phase 10: 신규 가입자 403 에러 해결 및 UI 개선
- [x] 신규 가입자 403 에러 해결 (권한 설정)
- [x] "No accommodation" 옵션 제거

## Phase 11: Featured Jobs 섬션 추가
- [x] Featured Jobs 섬션 UI 디자인 (3열 그리드)
- [x] Featured 배지 및 NOC 코드 표시
- [x] "View All Jobs" 링크 추가

## Phase 12: 상단 네비게이션 및 히어로 섹션 리디자인
- [ ] 상단 네비게이션 바 추가 (로고, 메뉴, 프로필)
- [ ] 다크 블루 배경 히어로 섹션 구현
- [ ] 검색 바 및 카테고리 필터 버튼 추가
- [ ] 통계 섹션 추가 (Active Jobs, Cities, LMIA Verified, Free)

## Phase 13: 공고 카드 UI 개선 및 상세 페이지
- [x] Apply Now 버튼 제거
- [x] 카드 배경색 변경 (빨간색 제거)
- [x] 공고 카드 클릭 시 상세 페이지로 이동
- [x] 공고 상세 페이지 생성

## Phase 14: 공고 카드 배경색 변경
- [x] Featured Jobs 카드 배경색을 흰색으로 변경
- [x] 일반 공고 목록 카드 배경색을 흰색으로 변경


## Phase 15: 헤더 및 히어로 섹션 리디자인
- [x] 상단 네비게이션 헤더 구성 (LMIAJobs 로고, Find Jobs/Post a Job/LMIA Guide, 프로필 아이콘)
- [x] 다크 네이비 배경 히어로 섹션 구현
- [x] "Find LMIA-Approved Jobs in Canada" 제목 (LMIA-Approved는 빨간색)
- [x] 검색 바 및 "Search Jobs" 빨간색 버튼
- [x] 필터 버튼 추가 (LMIA Jobs, Visa Sponsorship, Nursing Jobs, Truck Driver Jobs)
- [x] 통계 섹션 추가 (Active Jobs, Cities, LMIA Verified, Free)


## Phase 16: 필터 버튼 기능 구현
- [x] 필터 상태 관리 (LMIA Jobs, Visa Sponsorship, Nursing Jobs, Truck Driver Jobs)
- [x] 필터 버튼 클릭 핸들러 구현
- [x] 필터 로직 적용 및 공고 필터링
- [x] 필터 상태 표시 (선택된 필터 강조)


## Phase 17: 모바일 UI 개선
- [x] 헤더 네비게이션 모바일 최적화 (LMIA Guide를 하단으로 이동)
- [x] 검색 통계 섹션 추가 (최근 검색 업종, 많이 등록된 업종)
- [x] 통계 섹션 2x2 그리드 레이아웃 변경 (모바일 최적화)


## Phase 18: 검색 통계 및 카드 UI 개선
- [x] 검색 통계 섹션 글씨 가시성 개선 (더 진한 색상)
- [x] 검색 통계 항목 5-6개로 확대
- [x] Featured Jobs 카드에서 Apply 버튼 제거
- [x] Featured Jobs 카드 전체를 클릭 가능하게 변경 (상세보기 페이지로 이동)


## Phase 19: 필터 기능 완성 및 글씨 가시성 개선
- [x] LMIA Jobs 필터: LMIA 공고만 표시
- [x] Nursing Jobs 필터: LMIA + Nursing 공고 표시
- [x] Truck Driver Jobs 필터: LMIA + Truck Driver 공고 표시
- [x] 검색 통계 섹션 직업명 글씨 더 크고 진하게 표시


## Phase 20: 검색 통계 직업명 클릭 필터링
- [x] 검색 통계 직업명을 클릭 가능하게 변경
- [x] 직업명 클릭 시 해당 로직 구현
- [x] 선택된 직업명 강조 표시


## Phase 21: 공고 카드 배지 단순화
- [x] 공고 카드에서 Visa Sponsorship Available 텍스트 제거
- [x] LMIA 배지만 표시되도록 수정

## Phase 22: 사이트 리브래단딩 (LMIA → 일반 채용 플래폰)
- [x] 사이트 이름 변경 (LMIAJobs → CanadaJobs)
- [x] 헤더 네비게이션 업데이트 (LMIA Guide → Job Guide)
- [x] 히어로 섹션 제목 및 설명 변경
- [x] 필터 버튼 이름 업데이트 (LMIA Jobs → LMIA Approved)
- [x] 필터 로직 업데이트


## Phase 23: 모바일 필터 버튼 레이아웃 개선
- [x] 필터 버튼을 2줄 배치로 변경 (모바일에서 2x2 그리드)
- [x] 데스크톱에서는 기존 1줄 배치 유지
