const cardClassName =
  "overflow-hidden rounded-lg border border-border bg-card shadow";
const statLabelClassName = "truncate text-sm font-medium text-muted-foreground";
const statValueClassName = "text-lg font-medium text-foreground";

const DashboardPage = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome to your accounting dashboard. Here&#39;s an overview of your
          recent activity.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className={cardClassName}>
          <div className="p-5">
            <div className="flex items-center">
              <div className="shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                  <svg
                    className="h-5 w-5 text-primary-foreground"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className={statLabelClassName}>Total Invoices</dt>
                  <dd className={statValueClassName}>24</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className={cardClassName}>
          <div className="p-5">
            <div className="flex items-center">
              <div className="shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-success">
                  <svg
                    className="h-5 w-5 text-success-foreground"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className={statLabelClassName}>Paid Invoices</dt>
                  <dd className={statValueClassName}>18</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className={cardClassName}>
          <div className="p-5">
            <div className="flex items-center">
              <div className="shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-warning">
                  <svg
                    className="h-5 w-5 text-warning-foreground"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className={statLabelClassName}>Pending</dt>
                  <dd className={statValueClassName}>4</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className={cardClassName}>
          <div className="p-5">
            <div className="flex items-center">
              <div className="shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-danger">
                  <svg
                    className="h-5 w-5 text-danger-foreground"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className={statLabelClassName}>Overdue</dt>
                  <dd className={statValueClassName}>2</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
