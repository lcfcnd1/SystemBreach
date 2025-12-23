'use client';

export default function TrashViewer() {
  // Por ahora, la papelera está vacía
  // En el futuro se pueden implementar archivos eliminados
  const trashItems: Array<{ name: string; deletedDate: string }> = [];

  return (
    <div className="trash-viewer">
      <div className="trash-viewer-header">
        <h3>Papelera</h3>
      </div>
      <div className="trash-viewer-content">
        {trashItems.length === 0 ? (
          <div className="trash-viewer-empty">
            <p>La papelera está vacía</p>
          </div>
        ) : (
          <div className="trash-viewer-list">
            {trashItems.map((item, index) => (
              <div key={index} className="trash-viewer-item">
                <span>{item.name}</span>
                <span className="trash-viewer-date">{item.deletedDate}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

