import { Template } from '../types';
import modern from './modern';
import classic from './classic';
import creative from './creative';

const templates: Record<string, Template> = {
  modern,
  classic,
  creative,
};

export default templates;