# Deep Work Timer

[Wiki](https://github.com/earcherc/deep-work/wiki)

[Planning Doc](https://docs.google.com/document/d/1zfZVOmlV_5TOfJoYeOAtwDp23rfpGEp4Doelewh11Kg/edit?usp=sharing)

This 'Deep Work' companion app is designed to help users achieve optimal deep work routines. This app integrates features like metrics tracking, friend connectivity, and Pomodoro timers to enhance productivity and focus. Whether you're a professional looking to maximize efficiency or a student aiming to improve study habits, this app provides the tools necessary to establish and maintain a powerful deep work routine.

### Frontend

- **Next.js**: Utilized within a development Docker container for a consistent development environment and seamless SSR/SSG capabilities.
- **Jotai**: For efficient and straightforward state management.
- **TailwindCSS**: For a utility-first approach to styling.
- **React Query**: For network requests, state management, caching.

### Backend

- **FastAPI**: Running inside a development Docker container, providing a high-performance, easy-to-use framework for APIs.
- **Redis**: Used for caching and session management.
- **Session-Based Authentication**: To securely manage user sessions.
- **SQLModel (SQLAlchemy Abstraction)**: Simplifies interactions with the Postgres database.
- **Postgres**: The primary database for storing application data.
- **S3**: Amazon file storage service.

## Features

- **Pomodoro Timer**: A customizable Pomodoro timer to help users focus and take regular breaks.
- **Metrics Tracking**: Insights into productivity patterns and focus sessions.
- **Friend Connectivity**: Connect with friends, share progress, and stay motivated.
- **Customizable Routines**: Tailor your deep work routine to fit your personal preferences and schedule.