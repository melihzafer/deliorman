import { render, screen, fireEvent } from '@testing-library/react';
import MenuFiltered from '../MenuFiltered';

jest.mock('next-intl', () => ({
  useTranslations: () => {
    const translator = (key) => key;
    translator.raw = () => ({});
    return translator;
  },
}));

jest.mock('swiper/react', () => ({
  Swiper: ({ children, ...props }) => <div data-testid="swiper">{children}</div>,
  SwiperSlide: ({ children }) => <div data-testid="swiper-slide">{children}</div>,
}));

jest.mock('framer-motion', () => ({
  motion: { div: ({ children, ...props }) => <div {...props}>{children}</div> },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

jest.mock('@common/sliderProps', () => ({
  SliderProps: { menuSlider: {} },
}));

jest.mock('@components/menu/MenuItem', () => {
  return function MockMenuItem({ item }) {
    return <div data-testid="menu-item">{item.title}</div>;
  };
});

const mockCategories = [
  {
    name: 'Салати',
    slug: 'salads',
    items: [
      { title: 'Шопска Салата', text: 'Домати, краставици, сирене', amount: '8.50 лв.' },
      { title: 'Цезар', text: 'Айсберг, пармезан, крутони', amount: '12.00 лв.' },
    ],
  },
  {
    name: 'Основни',
    slug: 'main',
    items: [
      { title: 'Мешена скара', text: 'Кюфте, кебапче, свинска пържола', amount: '18.00 лв.' },
    ],
  },
  {
    name: 'Десерти',
    slug: 'desserts',
    items: [
      { title: 'Кюнефе', text: 'Традиционен турски десерт', amount: '9.00 лв.' },
      { title: 'Баклава', text: 'Домашна баклава', amount: '7.00 лв.' },
      { title: 'Сладолед', text: 'Ванилия и шоколад', amount: '5.00 лв.' },
    ],
  },
];

describe('MenuFiltered', () => {
  it('renders category navigation buttons for each category', () => {
    render(<MenuFiltered categories={mockCategories} />);

    expect(screen.getByText('Салати')).toBeInTheDocument();
    expect(screen.getByText('Основни')).toBeInTheDocument();
    expect(screen.getByText('Десерти')).toBeInTheDocument();

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(mockCategories.length);
  });

  it('renders all menu items from all categories', () => {
    render(<MenuFiltered categories={mockCategories} />);

    const items = screen.getAllByTestId('menu-item');
    expect(items).toHaveLength(6);

    expect(screen.getByText('Шопска Салата')).toBeInTheDocument();
    expect(screen.getByText('Цезар')).toBeInTheDocument();
    expect(screen.getByText('Мешена скара')).toBeInTheDocument();
    expect(screen.getByText('Кюнефе')).toBeInTheDocument();
    expect(screen.getByText('Баклава')).toBeInTheDocument();
    expect(screen.getByText('Сладолед')).toBeInTheDocument();
  });

  it('first category button is active by default', () => {
    render(<MenuFiltered categories={mockCategories} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons[0].className).toContain('active');
    expect(buttons[1].className).not.toContain('active');
    expect(buttons[2].className).not.toContain('active');
  });

  it('clicking a category button updates active state', () => {
    render(<MenuFiltered categories={mockCategories} />);

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]);

    expect(buttons[1].className).toContain('active');
    expect(buttons[0].className).not.toContain('active');
  });

  it('renders heading when provided', () => {
    const heading = {
      subtitle: 'Нашето Меню',
      title: 'Вкусни <em>ястия</em>',
      description: 'Разгледайте <strong>менюто</strong>',
    };

    render(<MenuFiltered heading={heading} categories={mockCategories} />);

    expect(screen.getByText('Нашето Меню')).toBeInTheDocument();
    expect(screen.getByText(/Вкусни/)).toBeInTheDocument();
    expect(screen.getByText(/Разгледайте/)).toBeInTheDocument();
  });

  it('does not render heading when heading is 0', () => {
    render(<MenuFiltered heading={0} categories={mockCategories} />);

    expect(screen.queryByText('Нашето Меню')).not.toBeInTheDocument();
    expect(screen.queryByClassName?.('tst-suptitle')).toBeUndefined?.();
  });
});
