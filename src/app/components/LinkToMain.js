import { Button } from '@/components/ui/button';

export default function LinkToMain() {
  return (
    <a
      href="https://cayetanopiazza.com/"
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none' }}
    >
      <Button
        variant="outline"
        style={{
          borderColor: 'var(--accent)',
          color: 'var(--accent)',
          backgroundColor: 'transparent',
        }}
      >
        ← cayetanopiazza.com
      </Button>
    </a>
  );
}
