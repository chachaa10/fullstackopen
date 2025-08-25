import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import Blog from './Blog';

describe('<Blog />', () => {
  const blog = {
    title: 'Testing Blog Component',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 10,
    user: {
      username: 'testuser',
      name: 'Test User',
    },
  };

  const user = {
    username: 'testuser',
    name: 'Test User',
  };

  const mockHandleLike = vi.fn();
  const mockHandleDelete = vi.fn();

  test('renders title and author, but does not render URL or likes by default', () => {
    render(
      <Blog
        blog={blog}
        user={user}
        handleLike={mockHandleLike}
        handleDelete={mockHandleDelete}
      />
    );

    // Check that the title and author are visible within the blog-summary
    const summaryElement = screen.getByText((content, element) => {
      return (
        element.classList.contains('blog-summary') &&
        content.includes('Testing Blog Component') &&
        content.includes('Test Author')
      );
    });
    expect(summaryElement).toBeInTheDocument();

    // Check that the blog-details section is hidden
    const blogDetailsDiv = screen
      .getByText('http://testurl.com')
      .closest('.blog-details');
    expect(blogDetailsDiv).toHaveStyle('display: none');

    // Also check that the likes element is within a hidden container
    const likesParentDiv = screen
      .getByText('likes 10')
      .closest('.blog-details');
    expect(likesParentDiv).toHaveStyle('display: none');
  });

  test('URL and likes are shown when view button is clicked', async () => {
    const { container } = render(
      <Blog
        blog={blog}
        user={user}
        handleLike={mockHandleLike}
        handleDelete={mockHandleDelete}
      />
    );

    const userEvt = userEvent.setup();
    const button = screen.getByText('view');
    await userEvt.click(button);

    const div = container.querySelector('.blog-details');
    expect(div).not.toHaveStyle('display: none');
  });

  test('event handler is called twice if like button is clicked twice', async () => {
    render(
      <Blog
        blog={blog}
        user={user}
        handleLike={mockHandleLike}
        handleDelete={mockHandleDelete}
      />
    );

    const userEvt = userEvent.setup();

    // First, click the view button to make the like button visible
    const viewButton = screen.getByText('view');
    await userEvt.click(viewButton);

    const likeButton = screen.getByText('like');
    await userEvt.click(likeButton);
    await userEvt.click(likeButton);

    expect(mockHandleLike).toHaveBeenCalledTimes(2);
  });
});
