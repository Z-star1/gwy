import { useRef, useState } from 'react';

interface Props {
  onExport: () => void;
  onImport: (data: unknown) => boolean;
}

export function BackupBar({ onExport, onImport }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  return (
    <section className="backup-bar">
      <div>
        <h2>本地备份</h2>
        <p>打卡、错题、模考和笔记都存在本机浏览器。换电脑、清缓存或重装前先导出 JSON。</p>
      </div>
      <div className="backup-actions">
        <button type="button" className="ghost-btn" onClick={() => { onExport(); setError(false); setMessage('已下载备份文件'); }}>
          导出备份
        </button>
        <button type="button" className="ghost-btn" onClick={() => inputRef.current?.click()}>
          导入备份
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            if (!file) return;
            try {
              const text = await file.text();
              const data = JSON.parse(text) as unknown;
              if (!window.confirm('导入将覆盖当前本机学习数据，确定？')) return;
              const ok = onImport(data);
              setError(!ok);
              setMessage(ok ? '已恢复备份' : '文件格式不对，没有改动当前数据');
            } catch {
              setError(true);
              setMessage('无法读取该文件，请选择本站导出的 JSON');
            }
          }}
        />
      </div>
      {message && <p className={`backup-msg ${error ? 'error' : ''}`}>{message}</p>}
    </section>
  );
}
