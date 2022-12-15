export const vertexShader = `
    attribute vec3 position;
    
    uniform mat4 u_worldViewProjection;

    varying vec4 v_color;
    
    void main() {
        gl_Position = u_worldViewProjection * vec4(position, 1.0);
        gl_PointSize = 1.0;
        v_color = vec4(1, 1, 1, 1);
    }
`;