# System Zarządzania Magazynem

System magazynowy typu Fullstack, umożliwiający zarządzanie produktami, magazynami oraz przepływem towarów. 

##  Technologię

- **Backend:** .NET 8 Web API (C#)
- **Frontend:** React (Vite) + Axios
- **Baza danych:** PostgreSQL 16
- **Uwierzytelnianie:** JWT (JSON Web Token) z obsługą ról (RBAC)
- **ORM:** Entity Framework Core
- **Konteneryzacja:** Docker & Docker Compose
 
##  Główne Funkcjonalności

- **Zarządzanie Produktami (CRUD):** Dodawanie, edycja, usuwanie i przeglądanie stanów magazynowych.
- **Zarządzanie Magazynami:** Osobny panel dla Administratora do tworzenia i usuwania lokalizacji magazynowych.
- **Transakcyjne Przenoszenie Towarów:** Bezpieczna operacja przesunięcia ilościowego między magazynami z wykorzystaniem **SQL Transactions**.
- **Bezpieczeństwo:** 
  - Podział na role: `Admin` (pełny dostęp) oraz `User` (zarządzanie towarami).
- **Filtrowanie i Wyszukiwanie:** Zaawansowane filtrowanie po stronie serwera z mechanizmem **Debouncingu** na frontendzie.

## Instrukcja Uruchomienia

Aplikacja jest w pełni skonteneryzowana. Do uruchomienia potrzebujesz jedynie zainstalowanego **Dockera**.

1. **Sklonuj repozytorium:**
   git clone <https://github.com/bartlomiejsitek/ProjektMagazynu>

2. **Uruchom projekt za pomocą Docker Compose:**
   W folderze głównym projektu, w wierszu poleceń należy wpisać:
    docker-compose up --build

4. **Dostęp do aplikacji:**
    Frontend: http://localhost:3000
    Backend (Swagger): http://localhost:5000/swagger

5. **System posiada automatyczny seed danych, który tworzy startowe konto administratora:**
    Login: admin
    Hasło: admin123
