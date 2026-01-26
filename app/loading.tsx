export default function Loading() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 lg:pb-0">
            {/* Header Skeleton */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-8">
                <div className="container-main">
                    <div className="skeleton h-8 w-48 mb-2"></div>
                    <div className="skeleton h-5 w-32"></div>
                </div>
            </div>

            {/* Content */}
            <div className="container-main py-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="card">
                            {/* Badge */}
                            <div className="flex justify-between mb-4">
                                <div className="skeleton h-6 w-16 rounded-full"></div>
                                <div className="skeleton h-4 w-20"></div>
                            </div>

                            {/* Title */}
                            <div className="skeleton h-6 w-full mb-2"></div>
                            <div className="skeleton h-6 w-3/4 mb-4"></div>

                            {/* Org */}
                            <div className="skeleton h-4 w-1/2 mb-6"></div>

                            {/* Details */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="skeleton h-4 w-full"></div>
                                <div className="skeleton h-4 w-full"></div>
                            </div>

                            {/* Footer */}
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <div>
                                    <div className="skeleton h-3 w-16 mb-1"></div>
                                    <div className="skeleton h-5 w-24"></div>
                                </div>
                                <div className="skeleton h-9 w-9 rounded-full"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
