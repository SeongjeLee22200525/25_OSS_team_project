# 🎬 Movie Archive (무비 아카이브)

> **공공데이터 API와 MockAPI를 활용한 React CRUD 영화 관리 서비스**

영화 데이터를 검색하고, 나만의 한줄평·평점·즐겨찾기로 관리할 수 있는 웹 애플리케이션입니다.  
React Hook Form과 Material UI를 사용하여 간결하고 직관적인 UI를 제공합니다.

---

## 🚀 배포 및 저장소
- **배포 URL:** (예정) https://25-oss-team-project.vercel.app  
- **GitHub:** https://github.com/SeongjeLee22200525/25_OSS_team_project  
- **팀원:** 박지호, 이성제  

---

## 🎯 프로젝트 개요

### 🔹 서비스 목적
> 영화진흥위원회(KOBIS) 공공데이터를 기반으로  
> 영화를 검색하고 개인 감상 기록을 남길 수 있는 CRUD 웹 서비스입니다.

### 🔹 주요 특징
- KOBIS OpenAPI로 영화 데이터 실시간 불러오기  
- MockAPI를 이용해 개인 평점·한줄평 저장  
- React Hook Form으로 입력 검증 및 상태관리  
- MUI 컴포넌트 기반 반응형 UI  

---

## 🧩 주요 기능

| 구분 | 기능 설명 |
|------|------------|
| 🔍 **검색(Search)** | 제목, 감독, 장르 기준 영화 검색 |
| 📝 **등록(Create)** | 검색 결과에서 “추가” 또는 “직접 추가하기”로 영화 저장 |
| 📖 **조회(Read)** | MyPage에서 나의 영화 리스트 조회 |
| ✏️ **수정(Update)** | 저장된 영화의 한줄평·평점·즐겨찾기 수정 |
| 🗑️ **삭제(Delete)** | MyPage에서 영화 삭제 |
| ☁️ **Open API 연동** | KOBIS 영화진흥위원회 API + MockAPI.io |
| 🎨 **UI Library** | MUI(Material UI) + React Hook Form |

---

## ⚙️ 기술 스택

| 구분 | 사용 기술 |
|------|------------|
| Frontend | React 18, React Router DOM |
| State / Form | React Hook Form |
| UI | Material UI (MUI) |
| Network | Fetch API |
| Backend | MockAPI.io |
| Open API | KOBIS 영화진흥위원회 API |

---

## 🗂️ 페이지 구성

### 🏠 HomePage (`/`)
영화 검색 및 API 연동 결과 화면  
![HomePage](./images/HomePage.png)

---

### 📄 MyPage (`/mypage`)
내가 저장한 영화 목록 관리 화면  
![MyPage](./images/MyPage.png)

---

### ➕ AddPage (`/add`)
새 영화 추가 (직접 입력 가능)  
![AddPage](./images/AddPage.png)

---

### ✏️ EditPage (`/edit/:id`)
저장된 영화 수정 화면  
![EditPage](./images/EditPage.png)
---

## ⚖️ 기획 대비 변경점

| 항목 | 기획서 내용 | 실제 구현 |
|------|--------------|------------|
| 🧠 **상태관리** | Zustand 전역 상태관리 | useState 로컬 상태관리 |
| 🎨 **UI 구성** | 카드 + 테이블 전환 | 테이블 중심 화면 구성 |
| 🖼️ **이미지 기능** | 포스터 표시 | 미구현 |
| 📤 **Export 기능** | CSV 내보내기 | 미구현 |
| 🧱 **핵심 CRUD** | 등록 / 수정 / 삭제 / 조회 | ✅ 완전 구현 |
| ☁️ **Open API** | KOBIS 공공데이터 연동 | ✅ 정상 연동 완료 |

> ✅ **핵심 CRUD 및 API 연동은 완벽히 구현되었으며,**  
> 상태관리·이미지·CSV 내보내기 등은 **추후 확장 계획**에 포함되어 있습니다.

---

## 🌱 향후 개선 방향
- Zustand를 통한 전역 상태관리  
- 포스터 이미지 입력 및 카드 뷰 추가  
- CSV Export 기능 추가  
- 사용자 로그인 및 개인별 즐겨찾기 분리  

---

## ⚙️ 실행 방법

# 설치
npm install

# 실행
npm start
