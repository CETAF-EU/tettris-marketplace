/* Import Dependencies */
import { 
    MDXEditor, UndoRedo, BlockTypeSelect, BoldItalicUnderlineToggles, CreateLink, 
    linkDialogPlugin, ListsToggle, listsPlugin, headingsPlugin, toolbarPlugin , maxLengthPlugin
} from '@mdxeditor/editor';
import classNames from 'classnames';
import jp from 'jsonpath'
import { isEmpty } from 'lodash';

/* Import Types */
import { FormField, Dict } from "app/Types";

/* Import Components */
import FormFieldTitle from './FormFieldTitle';


/* Props Type */
type Props = {
    field: FormField,
    values: Dict,
    SetFieldValue: Function
};


/**
 * Component that renders an input text field for a free, long text insert
 * @param field The provided form field
 * @param values The current values in the form state
 * @param SetFieldValue Function to set the value of a form field
 * @returns JSX Component
 */
const TextField = (props: Props) => {
    const { field, values, SetFieldValue } = props;

    /* Class Names */
    const formFieldClass = classNames({
        'b-error': (field.required && !isEmpty(values) && !jp.value(values, field.jsonPath))
    });

    return (
        <div>
            <FormFieldTitle field={field}
                values={values}
            />
            <MDXEditor markdown=""
                className={`${formFieldClass} b-grey br-corner mt-1 z-0`}
                
                plugins={[
                    headingsPlugin(),
                    linkDialogPlugin(),
                    listsPlugin(),
                    maxLengthPlugin(2000),
                    toolbarPlugin({
                        toolbarContents: ToolbarContents
                    })
                ]}
                onChange={(text: string) => SetFieldValue(field.jsonPath.replace('$', ''), text)}
            />
        </div>
    );
};

const ToolbarContents = () => (
    <>
        {' '}
        <UndoRedo />
        <BlockTypeSelect />
        <BoldItalicUnderlineToggles />
        <CreateLink />
        <ListsToggle />
    </>
);

export default TextField;