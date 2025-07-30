# Pharmacy Management System (PMS) - Architectural Refactoring

## Overview

This document describes the comprehensive architectural refactoring of the React/TypeScript pharmacy application to implement the Model-View-Presenter (MVP) pattern and Repository pattern as required for the university assignment.

## 🏗️ Architecture Implementation

### 1. Directory Structure Reorganization

The project has been restructured following Java-like package conventions:

```
src/com/longchau/pms/
├── domain/           # Core business entities (Models)
├── persistence/
│   ├── api/         # Repository interfaces
│   └── file/        # File-based repository implementations
├── ui/
│   ├── view/        # React components (Views)
│   └── presenter/   # Business logic classes (Presenters)
├── data/            # JSON data files for simulation
└── main/            # Main application entry point
```

### 2. Domain Models (Model Layer)

Created type-safe domain entities:

- **Product.ts**: Product and Category interfaces
- **Prescription.ts**: Prescription-related types
- **Order.ts**: Order and OrderItem interfaces

### 3. Repository Pattern Implementation

#### Repository Interfaces (`persistence/api/`)
- **IProductRepository.ts**: Product data access contract
- **IPrescriptionRepository.ts**: Prescription data access contract  
- **IOrderRepository.ts**: Order data access contract

#### File-Based Implementations (`persistence/file/`)
- **FileBasedProductRepository.ts**: In-memory product storage
- **FileBasedPrescriptionRepository.ts**: In-memory prescription storage
- **FileBasedOrderRepository.ts**: In-memory order storage with inventory integration

### 4. MVP Pattern Implementation

#### Presenters (`ui/presenter/`)
- **PrescriptionUploadPresenter.ts**: Handles prescription submission logic
- **PrescriptionValidationPresenter.ts**: Manages pharmacist validation workflow
- **OrderPresenter.ts**: Controls order creation and inventory management

#### Views (`ui/view/`)
- **PrescriptionUploadFrame.tsx**: File upload interface
- **PrescriptionValidationFrame.tsx**: Pharmacist review dashboard
- **OrderCreationFrame.tsx**: Order creation from validated prescriptions
- **InventoryManagementFrame.tsx**: Real-time stock management

## 🎯 Vertical Slice Implementation

### Task 3: Digital Prescription Submission
- **View**: `PrescriptionUploadFrame.tsx`
- **Presenter**: `PrescriptionUploadPresenter.ts`
- **Features**:
  - File validation (JPG, PNG, PDF, max 10MB)
  - Automatic status marking as "Pending Validation"
  - User prescription history display

### Task 5: Pharmacist Prescription Validation
- **View**: `PrescriptionValidationFrame.tsx`
- **Presenter**: `PrescriptionValidationPresenter.ts`
- **Features**:
  - Dashboard with filtering (pending, approved, rejected)
  - Approve/reject functionality with mandatory notes
  - Status update tracking

### Task 4: Order Placement with Prescription
- **View**: `OrderCreationFrame.tsx`
- **Presenter**: `OrderPresenter.ts`
- **Features**:
  - Validation that prescriptions are approved before order creation
  - Prescription-required product selection
  - Order total calculation
  - Delivery address collection

### Task 7: Real-time Inventory Management
- **View**: `InventoryManagementFrame.tsx`
- **Presenter**: `OrderPresenter.ts`
- **Features**:
  - Order completion workflow
  - Automatic stock decrementing
  - Before/after stock level display
  - Stock change history tracking

## 🔄 Data Flow Architecture

### MVP Flow Example (Prescription Upload):
1. **View** (`PrescriptionUploadFrame`) captures user input
2. **Presenter** (`PrescriptionUploadPresenter`) validates file and business rules
3. **Repository** (`FileBasedPrescriptionRepository`) persists data
4. **View** updates UI based on presenter response

### Repository Abstraction:
- Business logic depends on repository interfaces, not implementations
- File-based repositories simulate database operations
- Easy to swap implementations (file → database → API)

## 🚀 Key Features Implemented

### MVP Pattern Benefits:
- **Separation of Concerns**: Views are "dumb" and only handle UI
- **Testability**: Business logic is isolated in presenters
- **Maintainability**: Clear boundaries between layers

### Repository Pattern Benefits:
- **Data Access Abstraction**: Business logic doesn't depend on storage implementation
- **Flexibility**: Easy to change from file-based to database storage
- **Testing**: Mock repositories for unit testing

### File-Based Persistence:
- **JSON Data**: Simulates database tables
- **In-Memory Operations**: Demonstrates CRUD operations
- **Real-time Updates**: Shows inventory changes immediately

## 📱 Usage Instructions

### 1. Access the PMS Demo
Navigate to `/pms-demo` to access the refactored application.

### 2. Test the Vertical Slice
1. **Upload Prescription**: Use Task 3 tab to upload a prescription file
2. **Validate Prescription**: Switch to Task 5 tab (pharmacist role) to approve/reject
3. **Create Order**: Use Task 4 tab to create order from validated prescription
4. **Complete Order**: Use Task 7 tab to complete order and see inventory update

### 3. Observe Architecture
- Notice how Views are simple and delegate to Presenters
- See how Repositories abstract data access
- Watch real-time inventory updates when orders complete

## 🔧 Technical Implementation Details

### Type Safety:
- Full TypeScript implementation
- Strongly typed interfaces throughout
- No `any` types used

### Error Handling:
- Presenters return result objects with success/error states
- Views display user-friendly error messages
- Repository errors are caught and handled gracefully

### Validation:
- File type and size validation
- Business rule enforcement (e.g., approved prescriptions only)
- Stock level checking before order creation

### State Management:
- React hooks for local component state
- Presenter classes for business state
- Repository pattern for data persistence state

## 🎓 Assignment Requirements Fulfillment

✅ **MVP Pattern**: Implemented with clear separation of Model, View, and Presenter
✅ **Repository Pattern**: Interface-based data access with file-based implementation
✅ **Project Structure**: Reorganized following specified package structure
✅ **Vertical Slice**: All four required business operations implemented
✅ **File-Based Persistence**: JSON-based data storage simulation
✅ **Real-time Inventory**: Automatic stock updates on order completion

## 📈 Potential Enhancements

### Future Improvements:
1. **Database Integration**: Replace file repositories with SQL/NoSQL implementations
2. **Authentication**: Integrate with existing user system
3. **Real-time Updates**: Add WebSocket support for live inventory updates
4. **Validation**: Enhanced business rule validation
5. **Reporting**: Add analytics and reporting features

### Testing Strategy:
1. **Unit Tests**: Test presenters in isolation with mock repositories
2. **Integration Tests**: Test repository implementations
3. **E2E Tests**: Test complete user workflows

This refactoring demonstrates professional software architecture principles while meeting all university assignment requirements.
