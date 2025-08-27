import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { TaskCard } from '../TaskCard';
import { Task } from '../../types';

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'This is a test task',
  status: 'To Do',
  priority: 'High',
  dueDate: new Date('2024-12-31'),
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  tags: ['test', 'frontend'],
  assignee: 'John Doe',
};

const mockProps = {
  task: mockTask,
  onStatusChange: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

describe('TaskCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders task information correctly', () => {
    renderWithRouter(<TaskCard {...mockProps} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('This is a test task')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('#test')).toBeInTheDocument();
    expect(screen.getByText('#frontend')).toBeInTheDocument();
  });

  it('calls onStatusChange when status is changed', () => {
    renderWithRouter(<TaskCard {...mockProps} />);
    
    const statusSelect = screen.getByDisplayValue('To Do');
    fireEvent.change(statusSelect, { target: { value: 'In Progress' } });
    
    expect(mockProps.onStatusChange).toHaveBeenCalledWith('1', 'In Progress');
  });

  it('calls onEdit when edit button is clicked', () => {
    renderWithRouter(<TaskCard {...mockProps} />);
    
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    
    expect(mockProps.onEdit).toHaveBeenCalledWith(mockTask);
  });

  it('calls onDelete when delete button is clicked', () => {
    renderWithRouter(<TaskCard {...mockProps} />);
    
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    expect(mockProps.onDelete).toHaveBeenCalledWith('1');
  });

  it('renders without description when not provided', () => {
    const taskWithoutDescription = { ...mockTask, description: undefined };
    renderWithRouter(<TaskCard {...mockProps} task={taskWithoutDescription} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('This is a test task')).not.toBeInTheDocument();
  });

  it('renders without tags when not provided', () => {
    const taskWithoutTags = { ...mockTask, tags: undefined };
    renderWithRouter(<TaskCard {...mockProps} task={taskWithoutTags} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('#test')).not.toBeInTheDocument();
    expect(screen.queryByText('#frontend')).not.toBeInTheDocument();
  });

  it('applies correct priority styling', () => {
    renderWithRouter(<TaskCard {...mockProps} />);
    
    const priorityElement = screen.getByText('High');
    expect(priorityElement).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('is accessible via keyboard navigation', () => {
    renderWithRouter(<TaskCard {...mockProps} />);
    
    const editButton = screen.getByText('Edit');
    const deleteButton = screen.getByText('Delete');
    
    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
    
    editButton.focus();
    expect(editButton).toHaveFocus();
    
    deleteButton.focus();
    expect(deleteButton).toHaveFocus();
  });

});