import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import axios from 'axios';

axios.defaults.baseURL = "https://dev-zee5api.kelltontech.net/api/v1.0"
configure({ adapter: new Adapter(), disableLifecycleMethods: true });
jest.setTimeout(30000)