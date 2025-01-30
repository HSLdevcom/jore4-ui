import { ElementType, FC, ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

type PageTitleBaseProps = {
  readonly as: ElementType;
  readonly className?: string;
  readonly testId?: string;
};

type SimplePageTitleProps = {
  readonly children: string;
  readonly titleText?: string;
};

type ComplexPageTitleProps = {
  readonly children: ReactNode;
  readonly titleText: string;
};

type PageTitleProps = PageTitleBaseProps &
  (SimplePageTitleProps | ComplexPageTitleProps);

const PageTitleImpl: FC<PageTitleProps> = ({
  as: As, // Capitalized so that it can be used as a <JsxConstructor>
  children,
  className,
  testId,
  titleText,
}) => {
  const { t } = useTranslation();

  const title = titleText ?? children;

  if (typeof title !== 'string') {
    throw new Error(
      `Either a string based children or a titleText prop must be provided! Children: ${children} | titleText: ${titleText}`,
    );
  }

  // Only pass data-testid to HTML Elements.
  // Provide React components with both data- and custom prop version.
  const testIdProps =
    typeof As === 'string'
      ? { 'data-testid': testId }
      : { 'data-testid': testId, testId };

  return (
    <>
      <Helmet>
        <title>{t('navigation.pageTitle', { title })}</title>
      </Helmet>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <As className={className} {...testIdProps}>
        {children}
      </As>
    </>
  );
};

function getElementName(as: ElementType): string {
  if (typeof as === 'string') {
    return as;
  }

  if (as.displayName) {
    return as.displayName;
  }

  return as.name || 'UnnamedBaseElement';
}

type FixedElementPageTitleProps = Omit<PageTitleBaseProps, 'as'> &
  (SimplePageTitleProps | ComplexPageTitleProps);

function createFixedElementPageTitle(
  as: ElementType,
): FC<FixedElementPageTitleProps> {
  const FixedElementPageTitle: FC<FixedElementPageTitleProps> = (props) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <PageTitleImpl as={as} {...props} />
  );

  const elementName = getElementName(as);
  const capitalizedElementName = `${elementName.charAt(0).toUpperCase()}${elementName.slice(1)}`;
  FixedElementPageTitle.displayName = `PageTitle${capitalizedElementName}`;

  return FixedElementPageTitle;
}

export const PageTitle = Object.assign(PageTitleImpl, {
  H1: createFixedElementPageTitle('h1'),
  H2: createFixedElementPageTitle('h2'),
  H3: createFixedElementPageTitle('h3'),
  H4: createFixedElementPageTitle('h4'),
  H5: createFixedElementPageTitle('h5'),
  H6: createFixedElementPageTitle('h6'),
});
