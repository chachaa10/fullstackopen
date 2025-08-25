import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import blogService from '../services/blogs';
import CreateBlog from './CreateBlog';

// Mock the blogService.create function
vi.mock('../services/blogs', () => ({
  default: {
    create: vi.fn(),
  },
}));

describe('<CreateBlog />', () => {
  test('form calls blogService.create with the right details when a new blog is created', async () => {
    const blogs = [];
    const mockSetBlogs = vi.fn();
    const mockSetNotification = vi.fn();
    const mockSetIsSuccess = vi.fn();
    const mockRef = { current: { toggleVisibility: vi.fn() } };

    render(
      <CreateBlog
        blogs={blogs}
        setBlogs={mockSetBlogs}
        setNotification={mockSetNotification}
        setIsSuccess={mockSetIsSuccess}
        ref={mockRef}
      />
    );

    const user = userEvent.setup();

    const titleInput = screen.getByLabelText('title:');
    const authorInput = screen.getByLabelText('author:');
    const urlInput = screen.getByLabelText('url:');
    const createButton = screen.getByText('create');

    await user.type(titleInput, 'Test Title');
    await user.type(authorInput, 'Test Author');
    await user.type(urlInput, 'http://testurl.com');

    await user.click(createButton);

    expect(blogService.create).toHaveBeenCalledTimes(1);
    expect(blogService.create).toHaveBeenCalledWith({
      title: 'Test Title',
      author: 'Test Author',
      url: 'http://testurl.com',
    });
  });
});
