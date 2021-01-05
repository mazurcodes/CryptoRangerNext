import { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/client';
import { useForm } from 'react-hook-form';
import Forbiden from '../../components/Forbiden/Forbiden';
import FormBigInput from '../../components/Form/FormBigInput';
import FormSmallInput from '../../components/Form/FormSmallInput';
import { formModel } from '../../models';
import styles from './Form.module.scss';

enum InputType {
  big = 'big',
  small = 'small',
  date = 'date',
  links = 'links',
}

type InputTypes = keyof typeof InputType;

interface InputProps {
  fieldId: string;
  fieldName: string;
  label: string;
  value: string;
  type: InputTypes;
  rows?: number;
  required?: boolean;
}

interface Props {
  id: number;
  formFields: InputProps[];
  ownerId: number;
}

const Form: NextPage<Props> = ({ id, formFields, ownerId }) => {
  const [session, loading] = useSession();
  const isOwnerCorrect = session ? ownerId === session.id : false;

  const { register, handleSubmit, watch, errors } = useForm<Props>();
  const onSubmit = async (data: InputProps) => {
    const modifiedFormFields = formFields.map((field) => {
      const value = data[field.fieldId];
      return {
        ...field,
        value,
      };
    });

    const updatedProject: Props = {
      id,
      formFields: modifiedFormFields,
      ownerId,
    };

    try {
      await fetch('http://localhost:3000/api/projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProject),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const deleteProject = async () => {
    await fetch('http://localhost:3000/api/projects', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
  };

  const inputList = formFields.map((input) => {
    // console.log('inputs', input);
    if (input.type === InputType.small || input.type === InputType.date)
      return (
        <FormSmallInput
          {...input}
          key={input.fieldId}
          name={input.fieldName}
          register={register}
        />
      );
    if (input.type === InputType.big)
      return (
        <FormBigInput
          {...input}
          key={input.fieldId}
          name={input.fieldName}
          register={register}
        />
      );
    return null;
  });

  if (session && !loading && !isOwnerCorrect) return <Forbiden />;
  if (!session && !loading) return <Forbiden />;
  if (loading) return null; // loader
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <img
        src="/images/cryptorangerlogo.svg"
        alt="Crypto Ranger logo"
        className={styles.formLogo}
      />
      {inputList}
      <input
        type="submit"
        className={styles.formSubmitBtn}
        value="Request Review"
      />
      <button
        type="button"
        className={styles.formSubmitBtn}
        onClick={deleteProject}
      >
        Delete project
      </button>
    </form>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const dummyProps = { formFields: [] };
  try {
    const data = await formModel.findFirst({
      where: {
        id: Number(context.query.id),
        ownerId: session.id,
      },
      select: {
        id: true,
        formFields: true,
        ownerId: true,
      },
    });
    // console.log(data);
    return {
      props: data || dummyProps,
    };
  } catch (error) {
    console.log(error);
    return {
      props: dummyProps,
    };
  }
};

export default Form;

// TODO: loading of session - loader maby?
