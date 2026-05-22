import type { GetServerSideProps } from "next";

export default function DashboardRedirect() {
	return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
	return {
		redirect: {
			destination: "/dashboard",
			permanent: false,
		},
	};
};
