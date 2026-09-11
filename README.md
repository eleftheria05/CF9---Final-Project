# Nail Salon Booking System

Σύστημα διαχείρισης κρατήσεων για nail salon, με backend REST API (Spring Boot) και frontend εφαρμογή (React). Υποστηρίζει τρεις ρόλους χρηστών (Πελάτη, Υπάλληλο, Διαχειριστή) με JWT authentication και role-based authorization.

## Τεχνολογίες

**Backend**
- Java 21, Spring Boot 4.1.1
- Spring Data JPA (Hibernate)
- Spring Security + JWT (jjwt)
- PostgreSQL 17
- Gradle
- Swagger / OpenAPI (springdoc)
- Docker & Docker Compose

**Frontend**
- React 19 + Vite
- React Router
- Axios
- Tailwind CSS

## Δομή Project

```
.
├── backend/          # Spring Boot REST API
├── frontend/         # React εφαρμογή
└── README.md
```

## Αρχιτεκτονική Επισκόπηση

Το backend ακολουθεί στρωματοποιημένη (layered) αρχιτεκτονική:

```
Controller → Service → Repository → Database
↑ ↓
DTOs Business Logic
```

- **Controller** — δέχεται HTTP requests, επιστρέφει HTTP responses. Δεν περιέχει business logic.
- **Service** — όλη η επιχειρησιακή λογική (validation rules, cascade ενέργειες, ownership checks, state transitions).
- **Repository** — πρόσβαση στη βάση δεδομένων μέσω Spring Data JPA.
- **DTOs (Request/Response)** — τα entities δεν εκτίθενται ποτέ απευθείας στο API· κάθε endpoint επικοινωνεί μέσω ειδικών DTO κλάσεων, με **Mapper** κλάσεις να κάνουν τη μετατροπή.
- **Exception Handling** — κεντρικός `GlobalExceptionHandler` μετατρέπει custom exceptions (π.χ. `ResourceNotFoundException`, `DuplicateResourceException`) σε καθαρά, ομοιόμορφα HTTP error responses.
- **Security** — `JwtAuthFilter` ελέγχει κάθε εισερχόμενο request, `SecurityConfig` ορίζει ποια endpoints είναι δημόσια, και `@PreAuthorize` annotations περιορίζουν ενέργειες ανά ρόλο.

Το frontend είναι δομημένο σε: `pages/` (πλήρεις οθόνες), `components/` (επαναχρησιμοποιήσιμα κομμάτια όπως το Navbar), `context/` (AuthContext για authentication state), `api/` (κεντρικό axios instance με JWT interceptor).

## Entities & Σχέσεις

| Entity | Περιγραφή | Σχέσεις |
|---|---|---|
| `User` | Λογαριασμός σύνδεσης (email, password, role) | `@OneToOne` με Customer ή Employee |
| `Customer` | Προφίλ πελάτη | `@OneToOne` με User |
| `Employee` | Προφίλ υπαλλήλου | `@OneToOne` με User, `@ManyToOne` με Salon |
| `Salon` | Κατάστημα | `@OneToMany` Employees |
| `ServiceOffering` | Προσφερόμενη υπηρεσία (π.χ. Manicure) | — |
| `Appointment` | Ραντεβού | `@ManyToOne` με Customer, Employee, ServiceOffering |

**Ρόλοι:** `CUSTOMER`, `EMPLOYEE`, `ADMIN` (enum `Role`, αποθηκεύεται στο `User`).

## Λειτουργίες ανά ρόλο

**CUSTOMER**
- Εγγραφή / Σύνδεση
- Προβολή καταστημάτων και υπαλλήλων τους
- Κράτηση ραντεβού (με έλεγχο διπλοκράτησης)
- Προβολή & ακύρωση δικών του ραντεβού

**EMPLOYEE**
- Σύνδεση (λογαριασμός δημιουργείται από ADMIN)
- Προβολή ραντεβού που του έχουν ανατεθεί
- Επιβεβαίωση (confirm) και ολοκλήρωση (complete) ραντεβού

**ADMIN**
- Πλήρη διαχείριση Καταστημάτων (Salons), Υπαλλήλων (Employees), Υπηρεσιών (Services)
- Δημιουργία, επεξεργασία, απενεργοποίηση/ενεργοποίηση (soft delete)
- Προβολή όλων των πελατών

## Προαπαιτούμενα

- Java 21 (JDK)
- Node.js 18+ και npm
- PostgreSQL 17 (για τοπική εκτέλεση χωρίς Docker) **ή** Docker Desktop

---

## Εκτέλεση Τοπικά (χωρίς Docker)

### 1. Backend

```bash
cd backend
```

Δημιουργήστε βάση δεδομένων στην τοπική σας PostgreSQL:

```sql
CREATE DATABASE nail_salon_db;
```

Ρυθμίστε το `src/main/resources/application.properties` (ή αφήστε τα defaults αν ταιριάζουν):

```properties
spring.datasource.url=jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:nail_salon_db}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD:your_password}
```

Εκτελέστε την εφαρμογή:

```bash
./gradlew bootRun
```

Η εφαρμογή θα ξεκινήσει στο `http://localhost:8080`.

Κατά την πρώτη εκκίνηση δημιουργείται αυτόματα λογαριασμός διαχειριστή:
- **Email:** `admin@nailsalon.com`
- **Password:** `admin123`

### 2. Frontend

Σε νέο Terminal:

```bash
cd frontend
npm install
npm run dev
```

Η εφαρμογή θα ξεκινήσει στο `http://localhost:5173`.

---

## Εκτέλεση με Docker

Το backend και η βάση δεδομένων μπορούν να τρέξουν πλήρως containerized.

### 1. Ρύθμιση μεταβλητών περιβάλλοντος

Στο φάκελο `backend/`, δημιουργήστε αρχείο `.env` με βάση το `.env.example`:

```
POSTGRES_PASSWORD=your_password_here
```

### 2. Εκτέλεση

```bash
cd backend
docker compose up --build
```

Αυτό θα ξεκινήσει δύο containers:
- `nail-salon-db` — PostgreSQL, στην πόρτα `5432`
- `nail-salon-app` — το backend, στην πόρτα `8080`

**Σημείωση:** Αν η τοπική σας PostgreSQL υπηρεσία τρέχει ήδη στην πόρτα 5432, σταματήστε την πρώτα ώστε να μη γίνει σύγκρουση πόρτας.

Το frontend τρέχει ξεχωριστά (βλ. παραπάνω) — δεν έχει μεταφερθεί ακόμα σε container, αφού είναι εργαλείο development (Vite dev server).

Τα δεδομένα της βάσης παραμένουν μεταξύ επανεκκινήσεων μέσω Docker volume.

## Environment Variables

| Μεταβλητή | Περιγραφή | Πού ορίζεται | Default |
|---|---|---|---|
| `DB_HOST` | Hostname της βάσης | `application.properties` | `localhost` |
| `DB_PORT` | Πόρτα της βάσης | `application.properties` | `5432` |
| `DB_NAME` | Όνομα βάσης | `application.properties` | `nail_salon_db` |
| `DB_USERNAME` | Χρήστης PostgreSQL | `application.properties` | `postgres` |
| `DB_PASSWORD` | Password PostgreSQL | `application.properties` / `.env` | — |
| `POSTGRES_PASSWORD` | Password για το Docker container της βάσης | `.env` (backend/) | — |
| `jwt.secret` | Μυστικό κλειδί υπογραφής JWT | `application.properties` | — |
| `jwt.expiration` | Διάρκεια ζωής token (ms) | `application.properties` | `86400000` (24ω) |

Οι μεταβλητές `DB_*` έχουν fallback τιμές, ώστε η ίδια εφαρμογή να τρέχει χωρίς αλλαγές τόσο τοπικά όσο και μέσω Docker (βλ. `docker-compose.yml` για τις τιμές που περνιούνται στο container).

---

## API Τεκμηρίωση (Swagger)

Με το backend σε λειτουργία (τοπικά ή Docker), η πλήρης τεκμηρίωση του API είναι διαθέσιμη στο:

```
http://localhost:8080/swagger-ui.html
```

Για δοκιμή protected endpoints: κάντε login μέσω `/api/auth/login`, πάρτε το token, και πατήστε **Authorize** πάνω δεξιά στο Swagger UI για να το εισάγετε.

## Authentication

Η εφαρμογή χρησιμοποιεί JWT (JSON Web Tokens) για authentication.

- `POST /api/auth/register` — δημόσια εγγραφή πελάτη (δημιουργεί ταυτόχρονα λογαριασμό χρήστη και προφίλ πελάτη)
- `POST /api/auth/login` — σύνδεση, επιστρέφει JWT token

Λογαριασμοί EMPLOYEE δημιουργούνται μόνο από ADMIN (μέσω `/api/employees`, με password).

## Βασικοί Επιχειρησιακοί Κανόνες

- Η διαγραφή Salon/Employee γίνεται με **soft delete** (απενεργοποίηση) — τα δεδομένα διατηρούνται για ιστορικούς λόγους.
- Η απενεργοποίηση ενός Salon απενεργοποιεί αυτόματα (cascade) όλους τους Employees του.
- Δεν επιτρέπεται διαγραφή μιας Υπηρεσίας (Service) που χρησιμοποιείται ήδη σε ραντεβού (409 Conflict).
- Δεν επιτρέπεται δημιουργία ραντεβού που επικαλύπτεται χρονικά με άλλο ραντεβού του ίδιου υπαλλήλου (409 Conflict).
- Ένας πελάτης μπορεί να δει/επεξεργαστεί μόνο το δικό του προφίλ (εκτός από ADMIN).

## Testing

Οι λειτουργίες του API έχουν δοκιμαστεί μη-αυτόματα μέσω Postman και Swagger UI, καλύπτοντας:
- Πλήρη CRUD ροές για κάθε entity
- Role-based access control (401/403 σε μη επιτρεπτές ενέργειες)
- Business rule validation (409 σε duplicate email, overlapping appointments, κλπ)
- End-to-end ροές μέσω του React frontend, για κάθε ρόλο (CUSTOMER, EMPLOYEE, ADMIN)

## Γνωστοί Περιορισμοί

- Δεν υπάρχει έλεγχος ωρών λειτουργίας καταστήματος (business hours) κατά την κράτηση ραντεβού.
- Η επανενεργοποίηση ενός Salon δεν επανενεργοποιεί αυτόματα τους Employees του (γίνεται χειροκίνητα, σκόπιμα, για λόγους ασφάλειας).
- Δεν έχουν προστεθεί automated unit/integration tests (JUnit/Mockito) — η εφαρμογή έχει δοκιμαστεί μη-αυτόματα.