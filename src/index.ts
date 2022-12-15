import App from './App';

/**
 * Main function of the program, creates an instance of Renderer, initializes its inputs and calls render method
 * Surrounded with try catch for warnings about initializing errors (eg. browser does not support WebGL, etc.)
 */
try {
    const app = new App();
    app.initGui().initControls().render();
} catch (exception) {
    console.warn(exception);
    alert('Exception during initialization, check console for further details');
}