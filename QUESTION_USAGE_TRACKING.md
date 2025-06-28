# Question Usage Tracking Feature

## ✨ Enhancement Overview

Đã thêm tính năng **Question Usage Tracking** vào Manage Questions page, cho phép admin theo dõi câu hỏi nào đang được sử dụng trong quiz nào và quản lý dependencies một cách thông minh.

## 🎯 New Features

### 1. **Quiz Usage Display**

- **Visual Indicators**: Mỗi question card hiển thị quiz nào đang sử dụng question đó
- **Usage Status**: Green badges cho questions được sử dụng, yellow warning cho unused questions
- **Click-to-Navigate**: Click vào quiz badge để navigate đến quiz đó
- **Usage Count**: Hiển thị số lượng quiz sử dụng question

### 2. **Smart Delete Protection**

- **Usage Warning**: Cảnh báo khi xóa question đang được sử dụng
- **Impact Assessment**: Hiển thị tên quiz sẽ bị ảnh hưởng
- **Enhanced Confirmation**: Detailed confirmation dialog với warning
- **Cascading Updates**: Tự động refresh quiz data sau khi delete

### 3. **Statistics in Header**

- **Total Questions**: Số lượng questions hiện tại
- **Used Questions**: Số questions đang được sử dụng trong quizzes
- **Real-time Updates**: Statistics cập nhật khi filter/search

### 4. **Visual Enhancements**

- **Color-Coded Status**: Green cho used questions, yellow cho unused
- **Icons Integration**: FileText và AlertCircle icons cho visual clarity
- **Responsive Badges**: Truncated quiz titles cho mobile display
- **Professional Styling**: Consistent với overall design system

## 🏗️ Technical Implementation

### Backend Integration

```typescript
// Sử dụng existing quiz API để fetch quiz data với populated questions
dispatch(fetchQuizzes()); // Get all quizzes with questions

// Function để tìm quizzes chứa specific question
const getQuizzesContainingQuestion = (questionId: string) => {
  return quizzes.quizzes.filter((quiz) =>
    quiz.questions.some((q) =>
      typeof q === "string" ? q === questionId : q._id === questionId
    )
  );
};
```

### Smart Delete Logic

```typescript
const handleDeleteQuestion = async (questionId: string) => {
  const usedInQuizzes = getQuizzesContainingQuestion(questionId);

  if (usedInQuizzes.length > 0) {
    // Show detailed warning với quiz names
    const quizTitles = usedInQuizzes.map((q) => q.title).join(", ");
    confirmMessage = `⚠️ WARNING: Used in ${usedInQuizzes.length} quiz(es): ${quizTitles}`;
  }

  // Refresh both questions và quizzes after deletion
  dispatch(fetchQuestions());
  dispatch(fetchQuizzes());
};
```

### Visual Status Display

```tsx
{
  /* Usage Status với color coding */
}
{
  usedInQuizzes.length > 0 ? (
    <div className="bg-green-50 border-green-200">
      <FileText className="w-3 h-3" />
      Used in {usedInQuizzes.length} quiz(es)
    </div>
  ) : (
    <div className="bg-yellow-50 border-yellow-200">
      <AlertCircle className="w-3 h-3" />
      Not used in any quiz yet
    </div>
  );
}
```

## 🎨 UI/UX Improvements

### Question Cards Enhanced

- **Usage Section**: Dedicated section cho quiz usage info
- **Status Indicators**: Clear visual status với icons và colors
- **Interactive Elements**: Clickable quiz badges để navigate
- **Responsive Layout**: Adaptive design cho all screen sizes

### Header Statistics

- **Multiple Badges**: Total questions + Used questions count
- **Real-time Updates**: Statistics change với search/filter
- **Professional Styling**: Consistent color scheme

### Delete Experience

- **Progressive Disclosure**: Simple confirm → Detailed warning nếu có usage
- **Impact Preview**: Show exactly which quizzes sẽ bị ảnh hưởng
- **Safe Defaults**: Encourage careful consideration

## 🔄 Data Flow

### Page Load Flow

1. Fetch questions data
2. Fetch quizzes data với populated questions
3. Calculate usage relationships
4. Display questions với usage status
5. Update header statistics

### Delete Flow

1. User clicks delete button
2. Check question usage trong quizzes
3. Show appropriate confirmation dialog:
   - Simple confirm nếu không được sử dụng
   - Detailed warning nếu có usage
4. Perform deletion nếu confirmed
5. Refresh both questions và quizzes data
6. Update UI với new state

### Usage Display Flow

1. For each question, scan all quizzes
2. Find quizzes containing question ID
3. Display usage status với appropriate styling
4. Enable navigation to related quizzes

## 📊 Usage Statistics

### Header Metrics

- **Total Questions**: `filteredQuestions.length`
- **Used Questions**: Questions có `getQuizzesContainingQuestion(q._id).length > 0`
- **Unused Questions**: Implied by difference

### Per-Question Metrics

- **Usage Count**: Number của quizzes sử dụng question
- **Quiz Names**: List of quiz titles using question
- **Usage Status**: Used/Unused với visual indicators

## 🚀 Benefits

### For Administrators

- **Better Oversight**: Clear view of question usage across system
- **Safe Management**: Prevent accidental deletion of important questions
- **Efficient Navigation**: Quick access to related quizzes
- **Data Integrity**: Maintain consistency between questions và quizzes

### For Content Management

- **Usage Tracking**: Identify popular vs unused questions
- **Cleanup Guidance**: Safely remove unused questions
- **Dependency Management**: Understand question-quiz relationships
- **Impact Assessment**: Preview effects before making changes

## 🎯 Future Enhancements (Optional)

### Advanced Analytics

- **Usage History**: Track question usage over time
- **Performance Metrics**: Success rates per question
- **Quiz Analytics**: Question effectiveness in different quizzes

### Bulk Operations

- **Bulk Usage Check**: Select multiple questions để check usage
- **Usage Export**: Export usage reports
- **Dependency Mapping**: Visual representation of relationships

### Enhanced Navigation

- **Quick Preview**: Hover để preview quiz content
- **Inline Editing**: Edit quiz từ question page
- **Usage Timeline**: When question was added to each quiz

## ✅ Testing Checklist

- [x] Display question usage correctly
- [x] Show unused questions với warning
- [x] Navigate to quizzes từ badges
- [x] Enhanced delete confirmation
- [x] Warning for used questions deletion
- [x] Header statistics update
- [x] Real-time filtering của statistics
- [x] Responsive design on all devices
- [x] Error handling cho API calls
- [x] Loading states during operations

## 🔧 Configuration

### No Additional Setup Required

- Uses existing quiz API endpoints
- Leverages current Redux store structure
- Builds on existing component architecture
- Maintains current authentication flow

### Performance Considerations

- Efficient filtering algorithms
- Minimal re-renders với React optimization
- Cached calculations for better performance
- Optimized API calls

---

**Status**: ✅ **COMPLETE** - Question usage tracking fully implemented với comprehensive UI/UX enhancements và safe deletion protection.
