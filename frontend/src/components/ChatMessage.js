import './ChatMessage.css';

function formatContent(text) {
  if (!text) return '';

  // Split into lines
  const lines = text.split('\n');
  const elements = [];
  let inList = false;
  let listItems = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="chat-list">
          {listItems.map((item, i) => (
            <li key={i}>{formatInline(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Empty line
    if (!line) {
      flushList();
      continue;
    }

    // Bullet points: *, -, •
    if (/^[\*\-•]\s+/.test(line)) {
      inList = true;
      listItems.push(line.replace(/^[\*\-•]\s+/, ''));
      continue;
    }

    // Numbered list
    if (/^\d+[\.\)]\s+/.test(line)) {
      inList = true;
      listItems.push(line.replace(/^\d+[\.\)]\s+/, ''));
      continue;
    }

    // Not a list item — flush any pending list
    flushList();

    // Headers (## or **Title**)
    if (/^#{1,3}\s+/.test(line)) {
      elements.push(
        <strong key={`h-${i}`} className="chat-heading">
          {line.replace(/^#{1,3}\s+/, '')}
        </strong>
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="chat-para">
        {formatInline(line)}
      </p>
    );
  }

  flushList();
  return elements;
}

function formatInline(text) {
  // Bold: **text** or __text__
  const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__)/g);
  return parts.map((part, i) => {
    if (/^\*\*(.+)\*\*$/.test(part)) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (/^__(.+)__$/.test(part)) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function ChatMessage({ role, content }) {
  return (
    <div className={`chat-message ${role}`}>
      <div className="chat-avatar">
        {role === 'user' ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 18c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 10h6M10 7v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <div className="chat-bubble">
        <div className="chat-role">{role === 'user' ? 'You' : 'MediVerse AI'}</div>
        <div className="chat-content">
          {role === 'assistant' ? formatContent(content) : content}
        </div>
      </div>
    </div>
  );
}
