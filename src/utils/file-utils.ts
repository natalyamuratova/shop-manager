interface SaveFileConfig {
    fileName: string;
    data: any;
    contentType: string;
}

export const saveFile = (config: SaveFileConfig) => {
    const anchor = document.createElement('a');
    const file = new Blob([JSON.stringify(config.data)], {type: config.contentType});
    anchor.href = URL.createObjectURL(file);
    anchor.download = config.fileName;
    anchor.style.visibility = 'hidden';
    anchor.click();
    window.URL.revokeObjectURL(config.data);
    return Promise.resolve();
}