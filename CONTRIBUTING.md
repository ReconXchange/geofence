# Contributing to TrackShift

Thank you for your interest in contributing to TrackShift! This document provides guidelines for contributing to the project.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies: `pnpm install`
4. Set up your database (see SETUP.md)
5. Run migrations: `pnpm prisma:migrate`
6. Start dev server: `pnpm dev`

## Code Style

- **TypeScript**: Use strict mode, avoid `any` types
- **Formatting**: Run `pnpm prettier --write .` before committing
- **Linting**: Run `pnpm lint` to check for issues
- **Naming**: Use descriptive names, follow existing conventions

## Project Structure

- `app/`: Next.js pages and API routes
- `components/`: Reusable React components
- `lib/`: Utility functions and helpers
- `prisma/`: Database schema and migrations
- `__tests__/`: Test files

## Making Changes

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Use prefixes:
- `feature/` for new features
- `fix/` for bug fixes
- `docs/` for documentation
- `refactor/` for code improvements

### 2. Write Code

- Follow mobile-first design principles
- Maintain TypeScript strict mode
- Add comments for complex logic
- Update documentation as needed

### 3. Write Tests

Add tests for new features:

```bash
# Create test file
touch __tests__/your-feature.test.ts

# Run tests
pnpm test
```

### 4. Commit Changes

Use conventional commit messages:

```bash
git commit -m "feat: add user notification system"
git commit -m "fix: resolve clock-in location bug"
git commit -m "docs: update setup instructions"
```

Format:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Pull Request Guidelines

### PR Title
Use the same format as commit messages:
- `feat: add real-time notifications`
- `fix: correct timezone handling`

### PR Description
Include:
- **What**: What changes were made
- **Why**: Why these changes are needed
- **How**: How the changes work
- **Testing**: How to test the changes
- **Screenshots**: For UI changes

### Example PR Description

```markdown
## What
Adds push notification support for shift reminders.

## Why
Users requested reminders before their scheduled shifts start.

## How
- Implemented Web Push API integration
- Added notification permission prompt
- Created notification scheduling service

## Testing
1. Allow notifications when prompted
2. Create a scheduled shift
3. Verify notification appears 15 minutes before

## Screenshots
[Include screenshots if UI changed]
```

## Code Review Process

1. Automated checks must pass (linting, tests)
2. At least one maintainer review required
3. All comments must be addressed
4. No merge conflicts

## Testing Requirements

- **Unit Tests**: For utility functions and API routes
- **Component Tests**: For React components
- **Integration Tests**: For complex workflows

Run tests:
```bash
pnpm test              # Run all tests
pnpm test -- --watch   # Watch mode
pnpm test -- --coverage # Coverage report
```

## Database Changes

If modifying the schema:

1. Update `prisma/schema.prisma`
2. Create migration: `pnpm prisma:migrate`
3. Update seed script if needed
4. Document changes in PR

## API Changes

When adding/modifying API routes:

1. Follow RESTful conventions
2. Add input validation (Zod)
3. Include error handling
4. Document in PR description
5. Update API documentation

## UI/UX Guidelines

- **Mobile-First**: Design for mobile, enhance for desktop
- **Accessibility**: Use semantic HTML, ARIA labels
- **Performance**: Optimize images, lazy load when possible
- **Consistency**: Follow existing design patterns
- **Testing**: Test on multiple devices/browsers

## Security Considerations

- Never commit secrets or credentials
- Validate all user input
- Use parameterized queries (Prisma handles this)
- Implement rate limiting for sensitive endpoints
- Follow OWASP guidelines

## Documentation

Update documentation when:
- Adding new features
- Changing APIs
- Modifying setup process
- Changing configuration options

Files to update:
- `README.md`: User-facing changes
- `SETUP.md`: Setup/deployment changes
- `PLAN.md`: Architecture changes
- Code comments: Complex logic

## Getting Help

- Check existing documentation (README, SETUP, PLAN)
- Search existing issues and PRs
- Ask in discussions
- Contact maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Code of Conduct

- Be respectful and professional
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the project
- Show empathy towards others

## Recognition

Contributors will be acknowledged in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to TrackShift! 🚀
