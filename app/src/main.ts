/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import {createApp} from 'vue'

// Plugins
import {addErrorHandlers, registerPlugins} from '@/plugins'

const app = createApp(App)

registerPlugins(app)
addErrorHandlers(app);

app.mount('#app');