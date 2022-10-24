CREATE TABLE public.email_gatway (
    id integer NOT NULL,
    active character varying(10) DEFAULT 'Y'::character varying NOT NULL,
    email character varying(200) NOT NULL,
    password character varying(200) NOT NULL,
    portno character varying(200) NOT NULL,
    smtpserver character varying(200) NOT NULL,
    createdby character varying(200) DEFAULT NULL::character varying
);


CREATE TABLE public.email_schedule (
    id integer NOT NULL,
    source_id integer NOT NULL,
    template_id integer NOT NULL,
    active character varying(10) NOT NULL,
    email_gaytway_id integer NOT NULL,
    schedule_date text,
    createdby character varying
);

CREATE TABLE public.email_send_statics (
    id integer NOT NULL,
    active character varying(10) DEFAULT 'Y'::character varying NOT NULL,
    user_email character varying(200) NOT NULL,
    image_path text NOT NULL,
    email_source_id integer NOT NULL,
    createdby character varying(200) NOT NULL,
    sendby character varying(200) NOT NULL,
    from_email character varying(200) NOT NULL,
    template_id integer NOT NULL,
    senddate character varying(50) NOT NULL,
    imagestaticpath text NOT NULL
);

CREATE TABLE public.email_source (
    id integer NOT NULL,
    active character varying(10) DEFAULT 'Y'::character varying NOT NULL,
    name character varying(200) NOT NULL,
    createdby character varying(200)
);

CREATE TABLE public.email_statics (
    id integer NOT NULL,
    ip_address character varying(200),
    uniq_id character varying(200),
    image_path text,
    viewdatetime character varying(50)
);

CREATE TABLE public.email_templates (
    id integer NOT NULL,
    name character varying(200) DEFAULT NULL::character varying,
    subject character varying(200) DEFAULT NULL::character varying,
    content text,
    active character varying(10) DEFAULT 'Y'::character varying,
    createdby character varying(10) DEFAULT NULL::character varying
);

CREATE TABLE public.role (
    id integer NOT NULL,
    name character varying(500),
    active character varying(5) DEFAULT 'Y'::character varying NOT NULL
);

CREATE TABLE public.user_email_source (
    id integer NOT NULL,
    active character varying(10) DEFAULT 'Y'::character varying NOT NULL,
    name character varying(200) NOT NULL,
    email_source_id integer,
    email_address character varying(200) NOT NULL,
    createdby character varying(200) DEFAULT NULL::character varying
);

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    roleid integer NOT NULL,
    active character varying(5) DEFAULT 'Y'::character varying NOT NULL
);
