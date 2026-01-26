export default function Loading() {
    return (
        <div className="container-premium py-12">
            {/* Header Skeleton */}
            <div className="mb-12 animate-pulse">
                <div className="w-32 h-6 bg-slate-200 rounded-full mb-4"></div>
                <div className="w-1/2 h-12 bg-slate-200 rounded-2xl mb-2"></div>
                <div className="w-2/3 h-6 bg-slate-100 rounded-xl"></div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-[32px] p-6 animate-pulse">
                        <div className="w-20 h-5 bg-slate-100 rounded-full mb-4"></div>
                        <div className="w-full h-8 bg-slate-200 rounded-xl mb-3"></div>
                        <div className="w-3/4 h-8 bg-slate-200 rounded-xl mb-6"></div>

                        <div className="space-y-3 mb-8">
                            <div className="w-1/2 h-4 bg-slate-100 rounded-lg"></div>
                            <div className="w-2/3 h-4 bg-slate-100 rounded-lg"></div>
                        </div>

                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                            <div className="w-24 h-8 bg-slate-50 rounded-lg"></div>
                            <div className="w-10 h-10 bg-slate-100 rounded-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
