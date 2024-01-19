import {
  Checkbox,
  InputWithLabel,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TextareaWithLabel
} from '@dealo/ui';

import { postQuery } from './query-actions';
import SubmitQueryButton from './SubmitQueryButton';

const ContactForm = () => {
  return (
    // @ts-ignore
    <form action={postQuery}>
      <div className="flex flex-col gap-8 p-6 rounded-sm border border-gray-200 dark:border-gray-600">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8">
          <InputWithLabel name="name" label="First Name" required/>
          <InputWithLabel name="email" label="Email" type="email" required/>
          <InputWithLabel name="company" label="Company"/>
          <div className="flex flex-col gap-2">
            <Label htmlFor="source">How did you hear about us?</Label>
            <Select name="source">
              <SelectTrigger>
                <SelectValue placeholder="Select a source"/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="search">Search engine</SelectItem>
                  <SelectItem value="social_media">Social media</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="mouth">Word of mouth</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <TextareaWithLabel name="message" label="Message" maxLength={1000} required/>
        <div className="flex gap-2">
          <Checkbox id="marketing-consent" name="consent" />
          <div className="flex flex-col gap-2">
            <Label htmlFor="marketing-consent">
              I agree to receive marketing communications from Dealo
            </Label>
            <p className="text-sm text-gray-500">
              We’ll send you the latest news about Dealo products and services,
              including information on features, pricing, and events. Unsubscribe
              anytime.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <SubmitQueryButton onSubmit={postQuery} />
          <p className="text-sm text-gray-500">
            By clicking submit, you agree to the processing of your personal information by
            Dealo as described in the Privacy Policy.
          </p>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;
